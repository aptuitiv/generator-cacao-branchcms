'use strict';
// Const Generator = require('yeoman-generator');
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

import config from './config.js';

import Generator from 'yeoman-generator';
import chalk from 'chalk';
import cowsay from 'cowsay';
import stripIndent from 'strip-indent';
import UpdateNotifier from 'update-notifier';
import yosay from 'yosay';

// Esmodule export for the constructor
export default class MG extends Generator {
    /**
     * Constructor
     * @param {String|Array} args
     * @param {Object} opts
     */
    constructor(args, opts) {
        super(args, opts);

        this.appName = 'Website';
        this.isThemeWebsite = false;
        this.includeMagnific = false;
        this.includeSlick = false;
        this.appBlog = false;
        this.appStore = false;

        // Check for newer versions of this generator and notify
        UpdateNotifier({pkg}).notify();

        this.argument('name', {
            type: String,
            required: false,
            description: 'The name of the project. If not set then you will be prompted.',
        });
    }

    /**
     * Sets the app name
     * @param {string} name
     * @private
     */
    _setAppName(name) {
        this.appName = name.replace(/\s+/g, '-').toLowerCase();
    }

    /**
     * Initialization
     */
    initializing() {
        // If the app name was passed as an argument then set it here
        if (typeof this.options.name !== 'undefined') {
            this._setAppName(this.options.name);
        }
    }

    /**
     * Questions
     * @returns {Promise.<TResult>|Promise}
     */
    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay('Starting the ' + chalk.red('Cacao BranchCMS') + ' website generator!'));

        const prompts = [];

        // Ask for the website project name if it's not already set
        if (typeof this.options.name === 'undefined') {
            prompts.push({
                type: 'input',
                name: 'name',
                message: 'What is the name of the website project?',
            });
        }

        // How to install packages - NPM or Yarn?
        prompts.push({
            type: 'list',
            name: 'installwith',
            message: 'Install packages with NPM or Yarn?',
            choices: ['NPM', 'Yarn'],
            default: 'NPM',
        });

        // Is this a theme website for BranchCMS?
        prompts.push({
            type: 'list',
            name: 'istheme',
            message: 'Is this a new theme website?',
            choices: ['Yes', 'No'],
            default: 'No',
        });

        // Front-end libraries to include
        prompts.push({
            type: 'checkbox',
            name: 'libraries',
            message: 'Check which libraries to include',
            choices: [
                {name: 'Magnific Popup', value: 'magnific', checked: false},
                {name: 'Slick slider', value: 'slick', checked: true},
            ],
        });

        // BranchCMS App templates to include
        prompts.push({
            type: 'checkbox',
            name: 'apps',
            message: 'Check which BranchCMS apps you will use for this website',
            choices: [
                {name: 'Blog', value: 'blog'},
                {name: 'Store', value: 'store'},
            ],
        });

        return this.prompt(prompts).then(answers => {
            // Set the app name if it was asked
            if (typeof answers.name !== 'undefined') {
                this._setAppName(answers.name);
            }

            // Tests to see if a value was selected in an answer
            const hasAnswer = (val, test) => val && val.indexOf(test) !== -1;

            // Set the node package manager option on the yeoman environment
            this.env.options.nodePackageManager = answers.installwith.toLowerCase();

            this.isThemeWebsite = answers.istheme.toLowerCase() === 'yes';

            this.includeMagnific = hasAnswer(answers.libraries, 'magnific');
            this.includeSlick = hasAnswer(answers.libraries, 'slick');

            this.appBlog = hasAnswer(answers.apps, 'blog');
            this.appStore = hasAnswer(answers.apps, 'store');
        });
    }

    /**
     * Create the source files
     */
    writing() {
        this.log('\n' + chalk.bold('Writing files') + '\n');

        this._setupConfigFiles();
        this._copySourceFiles();
        this._copyTemplateFiles();
    }

    /**
     * Sets up the package.json and other config files
     * @private
     */
    _setupConfigFiles() {
        // Editor Config
        this.fs.copy(
            this.templatePath('_editorconfig'),
            this.destinationPath('.editorconfig'),
        );

        // Eslint Config
        this.fs.copy(
            this.templatePath('_eslintrc.cjs'),
            this.destinationPath('.eslintrc.cjs'),
        );
        this.fs.copy(
            this.templatePath('_eslintignore'),
            this.destinationPath('.eslintignore'),
        );

        // Gitignore
        this.fs.copy(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore'),
        );

        // Prettier Config
        this.fs.copy(
            this.templatePath('_prettierrc.js'),
            this.destinationPath('.prettierrc.js'),
        );
        this.fs.copy(
            this.templatePath('_prettierignore'),
            this.destinationPath('.prettierignore'),
        );

        // Package.json
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                includeMagnific: this.includeMagnific,
                includeSlick: this.includeSlick,
            },
        );

        // Set the name value in the package.json
        this.packageJson.set('name', this.appName);

        const dependencies = {};
        if (this.includeMagnific) {
            dependencies['magnific-popup'] = config.packages['magnific-popup'];
        }

        if (this.includeSlick) {
            dependencies['slick-carousel'] = config.packages['slick-carousel'];
        }

        if (Object.keys(dependencies).length > 0) {
            this.addDependencies(dependencies);
        }

        // Stylelint
        this.fs.copy(
            this.templatePath('_stylelintrc'),
            this.destinationPath('.stylelintrc'),
        );

        // Copy the gulp configuration
        this.fs.copyTpl(
            this.templatePath() + '/gulp/**/*.ejs',
            this.destinationPath() + '/gulp',
            {
                includeMagnific: this.includeMagnific,
                includeSlick: this.includeSlick,
                isThemeWebsite: this.isThemeWebsite,
            },
            null,
            {
                /**
                 * Changes the ".ejs" file extension to ".js"
                 * @link https://github.com/SBoudrias/mem-fs-editor#copyfrom-to-options-context-templateoptions-
                 * @param {string} file
                 * @returns {string}
                 */
                processDestinationPath(destinationFile) {
                    return destinationFile.replace('.ejs', '.js');
                },
            },
        );

        // Copy other gulp files
        this.fs.copy(
            this.templatePath() + '/gulp/**/*.js',
            this.destinationPath() + '/gulp',
        );

        // If it's not a theme site them remove the gulp/export-theme.js file
        if (!this.isThemeWebsite) {
            this.fs.delete(this.destinationPath(0 + '/gulp/export-theme.js'));
        }

        // Gulpfile.js
        this.fs.copyTpl(
            this.templatePath('gulpfile.ejs'),
            this.destinationPath('gulpfile.js'),
            {
                isThemeWebsite: this.isThemeWebsite,
            },
        );
    }

    /**
     * Copies the boilerplate images, CSS and Javascript files
     */
    _copySourceFiles() {
        this.fs.copy(
            this.templatePath() + '/src/**/*',
            this.destinationPath() + '/src',
        );

        if (this.isThemeWebsite) {
            // Include the theme files in the main css file
            const themeInclude = `
                    /**
                     * Theme configuration
                     */

                    @import './theme';`;
            this.fs.append(this.destinationPath() + '/src/css/main.css', stripIndent(themeInclude));

            // Include the theme config files
            this.fs.copy(
                this.templatePath() + '/theme-starter/css/**/*',
                this.destinationPath() + '/src/css',
            );
        }
    }

    /**
     * Copy the BranchCMS template files
     * @private
     */
    _copyTemplateFiles() {
        const src = this.templatePath() + '/theme/';
        const dest = this.destinationPath() + '/src/theme/';

        // Copy the theme.json file
        this.fs.copy(
            src + 'theme.json',
            this.destinationPath() + '/src/theme.json',
        );

        // Copy the default site template
        this.fs.copy(
            src + 'one-column.twig',
            dest + 'one-column.twig',
        );
        this.fs.copy(
            src + 'two-column.twig',
            dest + 'two-column.twig',
        );

        // Copy the app templates
        const apps = [
            'content-builder',
            'content-layouts',
            'forms',
            'macros',
            'navigation',
            'search',
            'snippets',
        ];
        if (this.appBlog) {
            apps.push('blog');
        }

        if (this.appStore) {
            apps.push('store');
        }

        for (const app of apps) {
            this.fs.copy(
                src + app + '/**/*',
                dest + app,
            );
        }
    }

    /**
     * Finish
     */
    end() {
        this._build();
    }

    /**
     * Runs the gulp build
     * @private
     */
    _build() {
        this.log('\n\n' + chalk.bold('Running ' + chalk.yellow('gulp `build`') + ' task') + '\n');
        this.spawnCommand('gulp', ['build']).on('close', () => {
            this._done();
        });
    }

    /**
     * Output the closing message
     * @private
     */
    _done() {
        const cows = [
            'default',
            'cheese',
            'dragon-and-cow',
            'dragon',
            'elephant',
            'eyes',
            'ghostbusters',
            'goat',
            'hedgehog',
            'kitty',
            'koala',
            'luke-koala',
            'mech-and-cow',
            'meow',
            'milk',
            'moofasa',
            'moose',
            'sheep',
            'small',
            'squirrel',
            'stegosaurus',
            'turtle',
            'tux',
            'vader-koala',
            'vader',
            'whale',
            'www',
        ];
        const cow = cows[Math.floor(Math.random() * cows.length)];
        this.log(cowsay.say({
            text: '\nAll Done! Now go and build something great!\n',
            f: cow,
        }) + '\n');
    }
}


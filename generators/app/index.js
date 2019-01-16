'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const commandExists = require('command-exists').sync;
const cowsay = require('cowsay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const stripIndent = require('strip-indent');
const yosay = require('yosay');

module.exports = class extends Generator {
    /**
     * Constructor
     * @param {String|Array} args
     * @param {Object} opts
     */
    constructor(args, opts) {
        // Noinspection JSAnnotator
        super(args, opts);

        // Check for newer versions of this generator and notify
        updateNotifier({pkg}).notify();

        this.argument('name', {
            type: String,
            required: false,
            description: 'The name of the project. If not set then you will be prompted.'
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
        // Initialize configuration
        this.appName = 'Website';

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

        var prompts = [];

        // Ask for the website project name if it's not already set
        if (typeof this.options.name === 'undefined') {
            prompts.push({
                type: 'input',
                name: 'name',
                message: 'What is the name of the website project?'
            });
        }

        // Is this a theme website for BranchCMS?
        prompts.push({
            type: 'list',
            name: 'istheme',
            message: 'Is this a new theme website?',
            choices: ['Yes', 'No'],
            default: 'No'
        });

        // Front-end libraries to include
        prompts.push({
            type: 'checkbox',
            name: 'libraries',
            message: 'Check which libraries to include',
            choices: [
                {name: 'Magnific Popup', value: 'magnific', checked: true},
                {name: 'Slick slider', value: 'slick', checked: true},
                {name: 'Drift image zoom', value: 'driftzoom'}
            ]
        });

        // BranchCMS App templates to include
        prompts.push({
            type: 'checkbox',
            name: 'apps',
            message: 'Check which BranchCMS apps you will use for this website',
            choices: [
                {name: 'Blog', value: 'blog'},
                {name: 'Store', value: 'store'}
            ]
        });

        return this.prompt(prompts).then(answers => {
            // Set the app name if it was asked
            if (typeof answers.name !== 'undefined') {
                this._setAppName(answers.name);
            }

            // Tests to see if a value was selected in an answer
            const hasAnswer = (val, test) => val && val.indexOf(test) !== -1;

            this.isThemeWebsite = answers.istheme.toLowerCase() === 'yes';

            this.includeMagnific = hasAnswer(answers.libraries, 'magnific');
            this.includeSlick = hasAnswer(answers.libraries, 'slick');
            this.includeDrift = hasAnswer(answers.libraries, 'driftzoom');

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
            this.destinationPath('.editorconfig')
        );

        // Gitignore
        this.fs.copy(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore')
        );

        // Package.json
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                name: this.appName,
                includeDriftZoom: this.includeDrift,
                includeMagnific: this.includeMagnific,
                includeSlick: this.includeSlick
            }
        );

        // Stylelint
        this.fs.copy(
            this.templatePath('_stylelintrc'),
            this.destinationPath('.stylelintrc'),
        );

        this.fs.copyTpl(
            this.templatePath() + '/gulp/**/*',
            this.destinationPath() + '/gulp',
            {
                includeDriftZoom: this.includeDrift,
                includeMagnific: this.includeMagnific,
                includeSlick: this.includeSlick,
                isThemeWebsite: this.isThemeWebsite
            }
        );

        // Gulpfile.js
        this.fs.copyTpl(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            {
                isThemeWebsite: this.isThemeWebsite
            }
        );
    }

    /**
     * Copies the boilerplate images, CSS and Javascript files
     */
    _copySourceFiles() {
        this.fs.copy(
            this.templatePath() + '/src/**/*',
            this.destinationPath() + '/src'
        );

        if (this.isThemeWebsite) {
            // Include the theme files in the main css file
            let themeInclude = `
                    /**
                     * Theme configuration
                     */
                     
                    @import './theme';`;
            this.fs.append(this.destinationPath() + '/src/css/main.css', stripIndent(themeInclude));

            // Include the theme config files
            this.fs.copy(
                this.templatePath() + '/theme-starter/css/**/*',
                this.destinationPath() + '/src/css'
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
            this.destinationPath() + '/src/theme.json'
        );

        // Copy the default site template
        this.fs.copy(
            src + 'default.twig',
            dest + 'default.twig'
        );

        // Copy the app templates
        let apps = [
            'content-builder',
            'forms',
            'navigation',
            'search',
            'snippets'
        ];
        if (this.appBlog) {
            apps.push('blog');
        }
        if (this.appStore) {
            apps.push('store');
        }
        for (let app of apps) {
            this.fs.copy(
                src + app + '/**/*',
                dest + app
            );
        }
    }

    /**
     * Installation via yarn or npm
     */
    install() {
        this.log('\n');
        if (commandExists('yarn')) {
            this.yarnInstall();
        } else {
            this.npmInstall();
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
        this.log('\n\n' + chalk.bold('Running ' + chalk.yellow('gulp `build`') + ' task'));
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
            'www'
        ];
        const cow = cows[Math.floor(Math.random() * cows.length)];
        this.log(cowsay.say({
            text: '\nAll Done! Now go and build something great!\n',
            f: cow
        }) + '\n');
    }
};

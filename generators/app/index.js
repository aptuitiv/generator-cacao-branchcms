'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const commandExists = require('command-exists').sync;
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
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
        this.installer = 'yarn';

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
        this.log(yosay(
            'Starting the ' + chalk.red('Cacao BranchCMS') + ' website generator!'
        ));

        var prompts = [];
        if (typeof this.options.name === 'undefined') {
            prompts.push({
                type: 'input',
                name: 'name',
                message: 'What is the name of the website project?'
            });
        }

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

        return this.prompt(prompts).then(answers => {
            // Set the app name if it was asked
            if (typeof answers.name !== 'undefined') {
                this._setAppName(answers.name);
            }

            // Tests to see if a value was selected in an answer
            const hasAnswer = (val, test) => val && val.indexOf(test) !== -1;

            this.includeMagnific = hasAnswer(answers.libraries, 'magnific');
            this.includeSlick = hasAnswer(answers.libraries, 'slick');
            this.includeDrift = hasAnswer(answers.libraries, 'driftzoom');
        });
    }

    /**
     * Create the files
     */
    writing() {
        this.log(chalk.blue('Writing files'));
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

        // Config.js
        this.fs.copyTpl(
            this.templatePath('config.js'),
            this.destinationPath('config.js'),
            {
                includeDriftZoom: this.includeDrift,
                includeMagnific: this.includeMagnific,
                includeSlick: this.includeSlick
            }
        );

        // Gulpfile.js
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );
    }

    /**
     * Installation via yarn or npm
     */
    install() {
        const hasYarn = commandExists('yarn');
        this.installDependencies({
            npm: !hasYarn,
            bower: false,
            yarn: hasYarn
        });
    }

    /**
     * Closing function
     */
    end() {
        this.log('\n\nRunning ' + chalk.yellow('gulp `build`') + ' task');
        this.spawnCommand('gulp', ['build']).on('close', () => {
            this.log('\n\n' + chalk.blue('All Done! Now go and build something great!\n\n'));
        });
    }
};

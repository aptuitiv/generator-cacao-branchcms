'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
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
            type: 'list',
            name: 'installer',
            message: 'Do you use yarn or npm as an installer?',
            choices: ['yarn', 'npm']
        })

        return this.prompt(prompts).then(answers => {
            // Set the app name if it was asked
            if (typeof answers.name !== 'undefined') {
                this._setAppName(answers.name);
            }
            // Set installer
            this.installer = answers.installer;
        });
    }

    /**
     * Create the files
     */
    writing() {
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
            {name: this.appName}
        );

        // stylelint
        this.fs.copy(
            this.templatePath('_stylelintrc'),
            this.destinationPath('.stylelintrc'),
        );

        // Config.js
        this.fs.copy(
            this.templatePath('config.js'),
            this.destinationPath('config.js')
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
        if (this.installer == 'yarn') {
            this.yarnInstall();
        } else {
            // Install with npm
            this.npmInstall();
        }
    }
};

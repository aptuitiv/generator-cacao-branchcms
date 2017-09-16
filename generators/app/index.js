'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
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
        name = name.toLowerCase();
        name = name.replace(' ', '-');
        this.appName = name;
    }

    /**
     * Initialization
     */
    initializing() {
        // Initialize the app name
        this.appName = 'Website';

        // If the app name was passed as an argument then set it here
        if (typeof this.options.name !== 'undefined') {
            this._setAppName(this.options.name);
        }
    }

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

        return this.prompt(prompts).then(answers => {
            // Set the app name if it was asked
            if (typeof answers.name !== 'undefined') {
                this._setAppName(answers.name);
            }
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
        this.fs.copy(
            this.templatePath('_package.json'),
            this.destinationPath('package.json')
        );

        // Package.json
        this.fs.copy(
            this.templatePath('_stylelintrc'),
            this.destinationPath('.stylelintrc')
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

    install() {
        // This.installDependencies();
    }
};

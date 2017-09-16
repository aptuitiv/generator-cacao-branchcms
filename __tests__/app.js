'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-cacao-branchcms:app', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({name: 'Test Project'});
    });

    it('creates files', () => {
        assert.file([
            '.editorconfig',
            '.gitignore',
            '.stylelintrc',
            'package.json',
            'config.js',
            'gulpfile.js'
        ]);
    });
});

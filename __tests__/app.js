'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-cacao-branchcms:app', () => {
    beforeAll(() => helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({name: 'Test Project'}));

    it('creates files', () => {
        assert.file([
            '.editorconfig',
            '.gitignore',
            '.stylelintrc',
            'package.json',
            'gulpfile.js',
        ]);
    });
});

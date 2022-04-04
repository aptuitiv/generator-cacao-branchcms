# generator-cacao-branchcms [![NPM version][npm-image]][npm-url]
> [Yeoman](http://yeoman.io) generator that scaffolds out a new BranchCMS(https://www.branchcms.com) website that uses the Cacao CSS framework(https://github.com/aptuitiv/cacao).
Gulp(http://gulpjs.com/) is used for the build process.

## Installation

If you don't have [Yeoman](http://yeoman.io) already installed do that now.

We recommend [npm](https://www.npmjs.com/) and we assume you have pre-installed [node.js](https://nodejs.org/). You can also use [Yarn](https://yarnpkg.com/) if you prefer.

```
npm install -g yo
```

If you have not yet installed `generator-cacao-branchcms` do that now.

```
npm install -g generator-cacao-branchcms
```

## Generate the project

Navigate in the command line to the folder that you want to set up the project in. You may want to go ahead and initialize git and add your repository.

```
git init
git remote add origin YOUR_GIT_ORIGIN_HERE
```

Or, you can use `git clone` one directory up

```
git clone ssh://john@example.com/path/to/my-project.git 
cd my-project 
```

Then generate your new project:

```bash
yo cacao-branchcms
```

Follow the prompts and then the template files will be installed, packages will be installed with NPM or Yarn, and `gulp build` will be run to initialize the project.

Set up your FTP settings and use the `dist` folder as your base folder.

## Setting up BranchCMS and files

**Don't upload files via FTP yet. Certain things need to be set up in BranchCMS first.**

### Step 1

Disable the cache and CDN

- Go to Settings -> Cache and turn off the cache.
- Go to Settings -> CDN and make sure the CDN is turned off.

### Step 2

Search

- Create a search form called "Search". Set it as the default form. It is used for the search and search result pages. Edit it's template and rename the key to "search".
- Create a search form called "Search Header". It's a search form to use in the header of a page. Edit it's template and rename the key to "search-header".

If you don't set those up first then the uploaded templates aren't always recognized correctly
and aren't used.

### Step 3

Update the theme configuration with the theme.json file. This will set up templates, site settings, content builder elements and content layouts.

- Upload the `dist\theme\custom\theme.json` file to the website.
- Go to Design -> Themes -> View Themes
- Click on the `Update` button.
- Because you just uploaded the `theme.json` file leave the `Use Existing theme.json` value selected and click the `Next` button.
- Review the theme updates and click the `Next` button to finish.

### Step 4

Upload the rest of the files in the `dist` folder.

### Step 5

Log into BranchCMS and go to the following sections to load the appropriate templates.

**General Templates**

- Design -> Themes (initializes the theme)
- Design -> Templates
- Design -> Snippets
- Design -> Navigation -> Templates

**Forms**

- Forms -> Templates

**Search**

- Site Manager -> Search -> Design -> Content Templates. Edit each template and set the correct type.
- Site Manager -> Search -> Design -> App Pages. Set up the "Search" and "Search Results" pages.

Don't forget to go to Site Manager -> Search -> Dashboard and enable search if the website will use it. 

### Step 6

Create a navigation menu called "Main". Choose the "main" template. Add at least a few items to it.

### Step 7

Configure the rich text editor.

Go to Settings -> Rich Text Editor

Select the correct file for the "Import Stylesheets" section. It may be pre-filled in, but you should still click the `Browse` button to select the `theme\custom\css\main.css` file so that the correct S3 bucket path is set.

### Step 8

**Start Building!**

## Editing this Repository

Use `npm link` to do local development with this repository so that you can test your changes before pushing to NPM.

Navigate to the folder for this repository on your computer. Run `npm link`.

That will create a link between the repository folder and the global node_modules folder on your computer. You can now navigate to another folder outside this project and
run `yo cacao-branchcms` and Yeoman will use the files from this project on your computer instead of package you may have installed globally from NPM.

You will want to avoid installing this package from NPM globally on your computer as it may create problems with the `npm link`.

### Editing package versions

If you need to update the packages in the `package.json` file that is used in the templates then there are two places to update:

1. Within `app/templates/_package.json`. Update it like you would with any other `package.json` file.
2. For `magnific-popup` and `slick-carousel` update the versions in `app/config.js`.

## Updating this repository on NPM

You should be working off of the `develop` branch. If so, then start a new release branch with the version that you're updating to. The versioning should follow this pattern:

```
v1.7.0
```

Then [update the package version number](https://docs.npmjs.com/updating-your-published-package-version-number). Also see [npm-version CLI documentation](https://docs.npmjs.com/cli/version). 

```
npm version <update_type>
```

`<update_type>` could be one of `patch`, `minor`, `major`, `prepatch`, `preminor`, `premajor`, `prerelease`.

Then finish the release branch and push the `develop` and `main` branch to GitHub.

Then [publish the package to NPM](https://docs.npmjs.com/cli/publish).

```
npm publish
```

## License

MIT © [Aptuitiv](https://www.aptuitiv.com)


[npm-image]: https://badge.fury.io/js/generator-cacao-branchcms.svg
[npm-url]: https://npmjs.org/package/generator-cacao-branchcms

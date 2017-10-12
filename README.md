# generator-cacao-branchcms [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] 
> [Yeoman](http://yeoman.io) generator that scaffolds out a new BranchCMS(https://www.branchcms.com) website that uses the Cacao CSS framework(https://github.com/aptuitiv/cacao).
Gulp(http://gulpjs.com/) is used for the build process.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-cacao-branchcms using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-cacao-branchcms
```

Then generate your new project:

```bash
yo cacao-branchcms
```

## Setting up BranchCMS and files

### Step 1

**Before you upload files to the website set up the following components first**

- Content builder elements
- Search form

Search
- Create a search form called "Search". Set it as the default form. It is used for the search and search result pages. Edit it's template and rename the key to "search".
- Create a search form called "Search Header". It's a search form to use in the header of a page. Edit it's template and rename the key to "search-header".

If you don't set those up first then the uploaded templates aren't always recognized correctly
and aren't used.

### Step 2

Disable the cache

Go to Settings -> Cache and turn off the cache.

### Step 3

Upload files to the website.

### Step 4

Log into BranchCMS and go to the following sections to load the appropriate templates.

**General Templates**

- Design -> Themes (initializes the theme)
- Design -> Templates
- Design -> Snippets
- Design -> Navigation -> Templates

**Search**

- Site Manager -> Search -> Design -> Content Templates. Edit each template and set the correct type.
- Site Manager -> Search -> Design -> App Pages. Set up the "Search" and "Search Results" pages.

Don't forget to go to Site Manager -> Search -> Dashboard and enable search if the website will use it. 

### Step 5

Create a navigation menu called "Main". Choose the "main" template. Add at least a few items to it.

### Step 6

Setup the breadcrumb template.

Go to Settings -> Breadcrumb 

Change the "Breadcrumb template type" field to "Custom template" and enter the following code:
  
```
<div class="Breadcrumb">
    {% for item in items %}
        {% if item.isActive %}
            {{ item.text }}
        {% else %}
            <a href="{{ item.link }}" class="Breadcrumb-link">{{ item.text }}</a> &gt;
        {% endif %}
    {% endfor %}
</div>
```
 
### Step 7

Configure the rich text editor.

Go to Settings -> Rich Text Editor

Set `/theme/custom/css/main.css` as the file path for the "Import Stylesheets" section.

Under "Imag Classes", add the following values:

- Title: Image Left
- Class name:  Image Image--left


- Title: Image Right
- Class name:  Image Image--right

### Step 8

Set navigation classes.

Go to Design -> Navigation -> Settings

Add `is-` in front of each class. You will end up with something like:

`is-current`

### Step 9

**Start Building!**

## License

MIT © [Aptuitiv](https://www.aptuitiv.com)


[npm-image]: https://badge.fury.io/js/generator-cacao-branchcms.svg
[npm-url]: https://npmjs.org/package/generator-cacao-branchcms
[travis-image]: https://travis-ci.org/aptuitiv/generator-cacao-branchcms.svg?branch=master
[travis-url]: https://travis-ci.org/aptuitiv/generator-cacao-branchcms
[daviddm-image]: https://david-dm.org/aptuitiv/generator-cacao-branchcms.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/aptuitiv/generator-cacao-branchcms

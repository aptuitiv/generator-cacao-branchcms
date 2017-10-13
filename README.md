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

**BEFORE YOU UPLOAD FILES TO THE WEBSITE COMPLETE STEP 1 FIRST**

- Content builder elements
- Search form

Search
- Create a search form called "Search". Set it as the default form. It is used for the search and search result pages. Edit it's template and rename the key to "search".
- Create a search form called "Search Header". It's a search form to use in the header of a page. Edit it's template and rename the key to "search-header".

If you don't set those up first then the uploaded templates aren't always recognized correctly
and aren't used.

### Setup additional content bulder elements

**Add "Iframe Embed" component**

Fields:
- Embed Ratio
    - Type: Select Menu
    - Options:
        - 4by3
        - 3by2 (default)
        - 5by3
        - 2by1
        - 1by1
- Iframe Tag
    - Type: Iframe Embed
    - Description: Use this to embed an iframe like a Google Map iframe. Use the Media Embed element for YouTube videos or other media.
    
Template

```
<div class="FlexEmbed u-margBottom2">
    <div class="FlexEmbed-ratio FlexEmbed-ratio--{{ embedRatio }}"></div>
    <iframe class="FlexEmbed-content" frameborder="0" allowfullscreen src="{{ iframeTag.src }}"></iframe>
</div>
```

**Add "Media Embed" component**

Fields:
- Embed Ratio
    - Type: Select Menu
    - Options:
        - 4by3
        - 3by2 (default)
        - 5by3
        - 2by1
        - 1by1
- Embed URL
    - Type: Embed Url
    - Description: Enter the URL of the media content. For example, for YouTube simply enter the URL to view the video on the YouTube website.
        
Template

```
{% for url in embedUrl.urlInfo %}
    <div class="FlexEmbed u-margBottom2">
        <div class="FlexEmbed-ratio FlexEmbed-ratio--{{ embedRatio }}"></div>
        <iframe class="FlexEmbed-content" frameborder="0" allowfullscreen src="{{ url.iframeEmbed.src }}"></iframe>
    </div>
{% endfor %}
```

**Adjust the "Large Image" component**

Edit the "Large Image" component. Rename it to "Full Width Image".

Edit the image upload and set the width to 1200px wide with no height constraint.

Add the following field:

- Caption
    - Type: Text

**Adjust the "Small Image" component**

Edit the "Small Image" component.
Edit the "Image" field and set the size to 350 x 350.
Add the following fields. 

- Alignment
    - Type: Select Menu
    - Options:
        - Default
        - Center
        - Float Left
        - Float Right
- Caption
    - Type: Text
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

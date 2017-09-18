// The base directory to build into
var buildRoot = 'build';
// The directory within the build root where theme files (images, css, js) will be located
var themeRoot = 'theme/custom';
// The source directory to build from
var src = 'src';
// The full destination folder where assets (images, css, js) will be built into for distribution
var dist = buildRoot + '/' + themeRoot;

/**
 * Data that is set to the config variable in gulpfile.js
 */
module.exports = {
    /**
     * Paths for different asset sources and their distribution path
     */
    paths: {
        src: {
            css: [src + '/styles/index.css'],
            img: src + '/images/**/*.{png,jpg,gif,svg}',
            stylelint: [src + '/styles/**/*.css'],
            theme: src + '/theme/**/*.twig',
            themeFolder: src + '/theme'
        },
        dist: {
            base: dist,
            css: dist + '/css',
            img: dist + '/images',
            js: dist + '/js',
            theme: dist + '/templates',
            themeFiles: dist + '/templates/**/*.twig'
        },
        watch: {
            css: [src + '/styles/**/*.css']
        }
    },

    /**
     * Files to copy from another folder, typically node_modules.
     * src is the files to get
     * dest is the folder within the root 'dist' folder to put
     */
    copy: [
        <%_ if (includeDriftZoom) { _%>
            {
                src: ['node_modules/drift-zoom/dist/**/*.{min.css,min.js}'],
                    dest: 'drift-zoom'
            },
        <%_ } _%>
        <%_ if (includeMagnific) { _%>
        {
            src: ['node_modules/magnific-popup/dist/**/*.{css,min.js}'],
            dest: 'magnific'
        },
        <%_ } _%>
        <%_ if (includeSlick) { _%>
        {
            src: ['node_modules/slick-carousel/slick/*.{css,min.js,gif}'],
            dest: 'slick'
        },
        {
            src: ['node_modules/slick-carousel/slick/fonts/*'],
            dest: 'slick/fonts'
        }
        <%_ } _%>
    ],

    /**
     * Scripts to build
     * name: The name of the file to build
     * src: The sources for the file
     */
    scripts: [
        {
            name: 'index.js',
            src: [
                src + '/scripts/modernizr-flexbox-detection.js',
                'node_modules/jquery/dist/jquery.js',
                src + '/scripts/index.js'
            ]
        },
        {
            name: 'forms.js',
            src: [
                'node_modules/jquery-validation/dist/jquery.validate.js',
                'node_modules/jquery-form/src/jquery.form.js'
            ]
        }
    ]
};

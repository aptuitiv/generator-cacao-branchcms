/* =========================================================================== *\
    Global Javascript for all pages
\* =========================================================================== */


$(function() {
    smallScreenNav.init();

    // Back to top link handler
    var link = document.querySelector('.js-btop');
    link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
});

/**
 * Small screen navigation
 */
var smallScreenNav = {
    button: null,
    /**
     * Holds the navigation object
     * @type jQuery
     * @private
     */
    nav: null,

    /**
     * The max window width where the small screen navigation is shown
     * @type number
     * @private
     */
    width: 1050,

    /**
     * Initialization
     */
    init: function() {
        var self = this;
        this.button = $('.js-ssNavBtn');
        this.nav = $('.js-mainNav');

        this.button.on('click', function(e) {
            e.preventDefault();
            self.button.toggleClass('is-active');
            self.nav.toggle();
        });

        $('.js-dropdown').on('click', function(e) {
            if ($(window).width() <= self.width) {
                e.preventDefault();
                $(this).toggleClass('is-active').parent().toggleClass('is-active');
            }
        });
    }
};

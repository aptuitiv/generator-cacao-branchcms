/* global smallScreenNav:readonly, navAccess:readonly */

/* =========================================================================== *\
    Global Javascript for all pages
\* =========================================================================== */

// Initialization
$(() => {
    smallScreenNav.init();
    navAccess.init();

    // Back to top link handler
    const link = document.querySelector('.js-btop');
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    });
});

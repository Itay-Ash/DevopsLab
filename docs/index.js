$(document).ready(function () {
   /* // Scroll to the top on page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    $(window).scrollTop(0); */ //Disabled for testing

    //Coloring all completed steps
    const colors = [
        '#88beff',
        '#77b3ff',
        '#66a9ff',
        '#339aff',
        '#008cff',
        '#0078e6',
        '#0063cc',
        '#004fb3',
        '#003d99',  
        '#002680'   
    ];
    $('.step.completed').each(function(index) {
        $(this).css('background-color', colors[index]);
    });

    //Adding progress bar and navbar-title animations
    const navbarCenter = $('.navbar-center')
    const title = $('.navbar-title');
    const progressbarContainer = $('#progress-bar-container');

    navbarCenter.on('mouseenter', () => {
        title.addClass('moveup-animation');
    });

    navbarCenter.on('mouseleave', () => {
        if(!progressbarContainer.is(':visible'))
            title.removeClass('moveup-animation');

        if(progressbarContainer.is(':visible')){
            progressbarContainer.removeClass('appear-animation');
            progressbarContainer.addClass('disappear-animation');
        }
    });

    title.on('animationend', () => {
        if(!title.hasClass('movedown-animation')){
            title.hide();
            progressbarContainer.show();
            progressbarContainer.addClass('appear-animation');
            title.removeClass('moveup-animation');
        }
        else{
            title.removeClass('movedown-animation');
        }
    });

    progressbarContainer.on('animationend', () => {
        if(progressbarContainer.hasClass('disappear-animation')){
            title.show();
            title.addClass('movedown-animation');
            progressbarContainer.hide();
            progressbarContainer.removeClass('disappear-animation');
        }
    })

    //Hero buttons scroll
    $('.hero-buttons button').on('click', function (e) {
        const targetId =  $(this).data(''); 
        const delay = $(this).data('delay') * 750;
        $('html, body').animate({
            scrollTop: $(targetId).offset().top
        }, delay); 
    });

    //About section apperance animation
    const aboutSection = $('#about');
    const aboutTitle = $('#about-title');
    const aboutTexts = $('.about-text');

    $(window).on('scroll', function () {
        const scrollPosition = $(window).scrollTop();
        const sectionOffset = aboutSection.offset().top - window.innerHeight / 2;

        if (scrollPosition > sectionOffset) {
            aboutTitle.addClass('visible');

            aboutTexts.each(function (index) {
                const delay = $(this).data('delay') * 500;
                setTimeout(() => {
                        $(this).addClass('visible');
                }, delay);
            });
        }
    });

});

//Adding relative background based on mouse position
$(document).on('mousemove', function(e) {
    const $hero = $('.hero');
    const clientX = e.clientX;
    const clientY = e.clientY;

    const xPercent = (clientX / $(window).width()) - 0.5;
    const yPercent = (clientY / $(window).height()) - 0.5;

    $hero.css({
        'background-position-x': `${50 + xPercent * 10}%`,
        'background-position-y': `${50 + yPercent * 10}%`
    });
});


function convertPixelsToViewportUnits(pixels, type) {
    const viewportWidth = window.innerWidth;  // Width of the viewport in pixels
    const viewportHeight = window.innerHeight; // Height of the viewport in pixels

    if (type === 'vw') {
        return (pixels / viewportWidth) * 100; // Convert to vw
    } else if (type === 'vh') {
        return (pixels / viewportHeight) * 100; // Convert to vh
    } else {
        console.error("Invalid type. Use 'vw' or 'vh'.");
        return null;
    }
}

// Example usage:
var pixels = 20;
console.log("pixles:")
console.log(`${pixels}px in vw: ${convertPixelsToViewportUnits(pixels, 'vw')}vw`);
console.log(`${pixels}px in vh: ${convertPixelsToViewportUnits(pixels, 'vh')}vh`);
var pixels = 10;
console.log("pixles:")
console.log(`${pixels}px in vw: ${convertPixelsToViewportUnits(pixels, 'vw')}vw`);
console.log(`${pixels}px in vh: ${convertPixelsToViewportUnits(pixels, 'vh')}vh`);
var pixels = 4;
console.log("pixles:")
console.log(`${pixels}px in vw: ${convertPixelsToViewportUnits(pixels, 'vw')}vw`);
console.log(`${pixels}px in vh: ${convertPixelsToViewportUnits(pixels, 'vh')}vh`);
var pixels = 6;
console.log("pixles:")
console.log(`${pixels}px in vw: ${convertPixelsToViewportUnits(pixels, 'vw')}vw`);
console.log(`${pixels}px in vh: ${convertPixelsToViewportUnits(pixels, 'vh')}vh`);
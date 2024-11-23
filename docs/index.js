$(document).ready(function () {
    const colors = [
        '#88beff', // Darker light blue
        '#77b3ff', 
        '#66a9ff', // Mid-tone light blue
        '#339aff', // Vibrant mid-blue
        '#008cff', 
        '#0078e6', 
        '#0063cc', 
        '#004fb3', 
        '#003d99',  // Darker blue
        '#002680'   // Darkest blue
    ];
    $('.step.completed').each(function(index) {
        $(this).css('background-color', colors[index]);
    });
    
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
});
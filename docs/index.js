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
    
    let steps = [];
    let currentStep = 0;

    // Load steps from the JSON file
    $.getJSON("json/steps.json", function(data) {
        steps = data;
        renderStep();
    });

    // Render the current step
    function renderStep(direction) {
        if (steps.length === 0) return;

        const step = steps[currentStep];
        $("#step-image").attr("src", step.image);
        $("#step-title").text(step.title);

        // Populate actions list
        $("#step-actions").empty();
        step.action.forEach(function(action) {
            $("#step-actions").append("<li>" + action + "</li>");
        });

        // Disable/enable navigation buttons
        $("#prev-step").prop("disabled", currentStep === 0);
        $("#next-step").prop("disabled", currentStep === steps.length - 1);

        // Update step indicators
        const selectedStepButton = chooseActiveButton(currentStep, direction);
        $(".step-btn").removeClass("active");
        $(".step-btn").eq(selectedStepButton).addClass("active");

        // Update completion bar
        if (step.completed) {
            $("#completion-bar").removeClass("not-completed").addClass("completed").text("STEP COMPLETED");
        } else {
            $("#completion-bar").removeClass("completed").addClass("not-completed").text("STEP NOT COMPLETED");
        }
    }

    function chooseActiveButton(currentStep, direction){
        //If the current step is first or second
        if (currentStep <= 1)
            return currentStep;
        //If the last step is selected select the last button
        if(currentStep === steps.length -1)
            return 3;
        //If the one step before last is selected
        if(currentStep === steps.length - 2)
            return 2;
        //Move selected step based on users movement
        if(direction === '-')
            return 1;
        if(direction === '+')
            return 2;
    }

    // Handle "Prev" button click
    $("#prev-step").click(function() {
        if (currentStep > 0) {
            currentStep--;
            renderStep('-');
        }
    });

    // Handle "Next" button click
    $("#next-step").click(function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep('+');
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


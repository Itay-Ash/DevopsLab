$(document).ready(function () {
    // Scroll to the top on page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    $(window).scrollTop(0);

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
    const aboutSeparator = $('#about-separator');

    function aboutSectionApperance(){
        const scrollPosition = $(window).scrollTop();
        const sectionOffset = aboutSection.offset().top - window.innerHeight / 2;

        if (scrollPosition > sectionOffset) {
            aboutTitle.addClass('visible');

            let delay = 0;
            aboutTexts.each(function (index) {
                delay = $(this).data('delay') * 500;
                setTimeout(() => {
                        $(this).addClass('visible');
                }, delay);
            });

            setTimeout(() => {
                aboutSeparator.addClass('visible');
            }, delay + 500)
        }
    }

    //Progress section Data loading
    let steps = [];
    let currentStep = 0;
    
    // Load steps from the JSON file
    $.getJSON("json/steps.json", function(data) {
        steps = data;
        renderStep();
    });
    
    // Render the current step with animation
    function renderStep(direction) {
        if (steps.length === 0) return;
    
        const step = steps[currentStep];
    
        // Animate content out, then update and fade in
        $(".progress-container-right, .progress-container-left img")
    .fadeOut(500, function () {
        // Ensure content is completely hidden before updating
        $(this).hide();

        // Update image
        $("#step-image").attr("src", step.image);

        // Update title
        $("#step-title").text(step.title);

        // Populate actions list
        $("#step-actions").empty();
        step.action.forEach(function (action) {
            $("#step-actions").append("<li>" + action + "</li>");
        });

        // Update documentation icon visibility and link
        if (step.issue) {
            $("#documentation-link")
                .attr("href", step.issue)
                .show(); // Show the icon if issue exists
        } else {
            $("#documentation-link").hide(); // Hide the icon if no issue
        }

        // Update step indicators
        const selectedStepButton = chooseActiveButton(currentStep, direction);
        $(".step-btn").removeClass("active");
        $(".step-btn").eq(selectedStepButton).addClass("active");

        // Update completion bar
        if (step.issue) {
            $("#completion-bar")
                .removeClass("not-completed")
                .addClass("completed")
                .text("STEP COMPLETED");

            // Add clickable issue link if exists
            if (step.issue) {
                $("#completion-bar")
                    .css("cursor", "pointer")
                    .off("click")
                    .on("click", function () {
                        window.open(step.issue, "_blank");
                    });
            }
        } else {
            $("#completion-bar")
                .removeClass("completed")
                .addClass("not-completed")
                .text("STEP NOT COMPLETED")
                .css("cursor", "default")
                .off("click");
        }

        // Fade content back in
        $(this).fadeIn(50);
    });
    }
    
    // Logic for choosing the active step button
    function chooseActiveButton(currentStep, direction) {
        if (currentStep <= 1) return currentStep;
        if (currentStep === steps.length - 1) return 3; // Last button
        if (currentStep === steps.length - 2) return 2; // One before last
        return direction === '-' ? 1 : 2;
    }

    // Slider buttons functions
    $("#step-btn-1").click(function () {
        // First button: Always go to the first step
        if (currentStep !== 0) {
            currentStep = 0;
            renderStep('-');
        }
    });

    $("#step-btn-2").click(function () {
        // Second button: Dynamically handle backward and specific jumps
        if (currentStep === 0) {
            currentStep = 1; // Move forward to step 1 from step 0
            renderStep('+');
            return;
        }
        if (currentStep === 9) {
            currentStep = 7; // Jump back to step 7 from step 9
            renderStep('-');
            return;
        }
        if (currentStep === 1) {
            return; // Do nothing if already at step 1
        }
        currentStep--; // Default: Move backward by 1 step
        renderStep('-');
    });

    $("#step-btn-3").click(function () {
        // Third button: Dynamically handle forward and specific jumps
        if (currentStep === 9) {
            currentStep = 8; // Jump back to step 8 from step 9
            renderStep('-');
            return;
        }
        if (currentStep === 0) {
            currentStep = 2; // Jump forward to step 2 from step 0
            renderStep('+');
            return;
        }
        if (currentStep === 8) {
            return; // Do nothing if already at step 8
        }
        currentStep++; // Default: Move forward by 1 step
        renderStep('+');
    });

    $("#step-btn-4").click(function () {
        // Last button: Always go to the last step
        if (currentStep !== 9) {
            currentStep = 9;
            renderStep('-');
        }
    });

    
    // Handle "Prev" button click
    $("#prev-step").click(function() {
        if (currentStep > 0) {
            currentStep--;
            renderStep('-');
        }
        else{
            currentStep = steps.length - 1;
            renderStep('-');
        }
    });
    
    // Handle "Next" button click
    $("#next-step").click(function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep('+');
        }
        else{
            currentStep = 0;
            renderStep('+');
        }
    });

    let autoSlideInterval;

    // Start auto-sliding with a configurable delay
    function startAutoSlide(delay = 8000) {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(function() {
            if (currentStep < steps.length - 1) {
                currentStep++;
            } else {
                currentStep = 0; // Restart to the first slide after the last
            }
            renderStep('+'); // Move to the next step
        }, delay); // Set the delay
    }
    
    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Restart auto-slide with 12-second delay when a button is clicked
    function resetAutoSlideOnInteraction() {
        stopAutoSlide();
        startAutoSlide(12000);
    }
    
    // Bind to navigation buttons
    $("#prev-step, #next-step, .step-btn").click(function() {
        resetAutoSlideOnInteraction(); // Extend delay on interaction
    });
    
    // Call startAutoSlide() when the JSON data is loaded
    $.getJSON("json/steps.json", function(data) {
        steps = data;
        renderStep(); 
        // Start automatic slide switching with default 5 seconds
    });

    //Navbar buttons on click directs to specific step
    document.querySelectorAll('.step').forEach((stepElement, index) => {
        stepElement.onclick = () => {
            //Render speficic step
            currentStep = index;
            renderStep();
            $('html, body').animate({
                scrollTop: $(progress).offset().top
            }, 1000); 
        };
        stepElement.addEventListener('mouseenter', function () {
            if (steps[index] && steps[index].image) {
                // Create or update the preview container
                let preview = document.querySelector('#step-preview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.id = 'step-preview';
                    preview.style.position = 'absolute';
                    preview.style.backgroundColor = '#fff';
                    preview.style.padding = '5px';
                    preview.style.border = '1px solid #ccc';
                    preview.style.borderRadius = '8px';
                    preview.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    preview.style.zIndex = '1000';
                    preview.style.display = 'none';
                    document.body.appendChild(preview);
                }
    
                // Add the image to the preview container
                preview.innerHTML = `<img src="${steps[index].image}" alt="Step Preview" style="width: 100px; height: auto; display: block;">`;
                preview.style.display = 'block';
            }
        stepElement.addEventListener('mousemove', function (e) {
                const preview = document.querySelector('#step-preview');
                if (preview) {
                    preview.style.top = `${e.pageY + 15}px`; // Offset the preview slightly from the cursor
                    preview.style.left = `${e.pageX + 15}px`;
                }
            });

        // Hide the preview on mouse leave
        stepElement.addEventListener('mouseleave', function () {
            const preview = document.querySelector('#step-preview');
            if (preview) {
                preview.style.display = 'none';
            }
            });
        });
    });

    //Progress section apperance
    const progressSection = $('#progress');
    const progressTitle = $('.section-title');
    const progreesContainerLeft = $('.progress-container-left');
    const progressContainerRight = $('.progress-container-right');
    const completionBar = $('#completion-bar');
    const qouteSection = $('#quote');

    function progressSectionApperance(){
        startAutoSlide();
        const scrollPosition = $(window).scrollTop();
        const sectionOffset = progressSection.offset().top - window.innerHeight / 2;

        if (progressTitle.hasClass('hidden') && scrollPosition > sectionOffset) {
            progressTitle.addClass('visible');
            setTimeout(() => {
                progreesContainerLeft.addClass('visible');
            }, 500);
            setTimeout(() =>{
                progressContainerRight.addClass('visible');
            }, 800);
            setTimeout(() =>{
                if(!completionBar.hasClass('appear-animation') && completionBar.hasClass('hidden')){
                    completionBar.addClass('appear-animation');
                    setTimeout(() => {
                        completionBar.removeClass('appear-animation');
                        completionBar.removeClass('hidden');
                    }, 250);
                    completionBar.addClass('visible');
            };
            }, 1100);
            setTimeout(() => {
                qouteSection.addClass('visible');
            }, 1500)
        };
    }
    
    //Sections appearnces
    $(window).on('scroll', function () {
        aboutSectionApperance();
        progressSectionApperance();
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

function pxToVhVw(pxValue) {
    // Get the current viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Convert px to vh and vw
    const vhValue = (pxValue / viewportHeight) * 100;
    const vwValue = (pxValue / viewportWidth) * 100;

    // Log the results to the console
    console.log(`Input: ${pxValue}px`);
    console.log(`Equivalent in vh: ${vhValue.toFixed(2)}vh`);
    console.log(`Equivalent in vw: ${vwValue.toFixed(2)}vw`);
}

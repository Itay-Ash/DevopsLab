const title = document.querySelector('.title');
const progressbarContainer = document.getElementById('progress-bar-container');

title.addEventListener('animationend', () => {
    title.style.display = 'none'; // Hide the title after animation ends
    progressbarContainer.classList.remove("hidden");
    progressbarContainer.classList.add("appear-animation-class");
});
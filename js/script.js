const classList = ['button-primary', 'button-secondary', 'button-accent', 'button-info', 'button-success', 'button-warning', 'button-error'];
const targetElement = document.getElementById('invite');

let currentIndex = 0;

function cycleClasses() {
    targetElement.classList.replace(classList[currentIndex], classList[(currentIndex + 1) % classList.length]);
    currentIndex = (currentIndex + 1) % classList.length;
}

cycleClasses();
setInterval(cycleClasses, 2000);
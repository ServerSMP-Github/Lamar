const text = "404";
let index = 0;
let direction = 1;

function typewriter() {
    const typewriterText = document.getElementById("typewriter-text");

    if (direction === 1) typewriterText.textContent = text.slice(0, ++index);
    else typewriterText.textContent = text.slice(0, --index);

    if (index === text.length) direction = -1;
    else if (index === 0) direction = 1;

    setTimeout(typewriter, 500);
}

typewriter();
const shutter = document.querySelector('.shutter');
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');
const soundToggle = document.getElementById('soundToggle');
const themeToggle = document.getElementById('themeToggle');
const shutterSound = document.getElementById('shutterSound');
const appContainer = document.getElementById('app');

let isSoundOn = true;
let isMoving = false;
let moveInterval;
let fadeOutInterval;
let isDayMode = true;

function playShutterSound() {
    if (isSoundOn && !isMoving) {
        shutterSound.currentTime = 0;
        shutterSound.volume = 1;
        shutterSound.play();
        isMoving = true;
    }
}

function fadeOutSound() {
    clearInterval(fadeOutInterval);
    fadeOutInterval = setInterval(() => {
        if (shutterSound.volume > 0.1) {
            shutterSound.volume -= 0.1;
        } else {
            clearInterval(fadeOutInterval);
            shutterSound.pause();
            shutterSound.volume = 1;
            isMoving = false;
        }
    }, 50);
}

function moveShutter(direction) {
    const currentTop = parseInt(getComputedStyle(shutter).top);
    const maxTop = 0;
    const minTop = -320;
    const step = 16;
    let newTop;

    if (!isMoving) {
        playShutterSound();
    }

    if (direction === 'up') {
        newTop = Math.max(currentTop - step, minTop);
    } else {
        newTop = Math.min(currentTop + step, maxTop);
    }

    shutter.style.top = newTop + 'px';

    if (newTop === minTop || newTop === maxTop) {
        fadeOutSound();
        clearInterval(moveInterval);
    }
}

function startMoving(direction) {
    clearInterval(moveInterval);
    clearInterval(fadeOutInterval);
    shutterSound.volume = 1;
    moveInterval = setInterval(() => moveShutter(direction), 16);
}

function stopMoving() {
    clearInterval(moveInterval);
    fadeOutSound();
}

arrowUp.addEventListener('mousedown', () => startMoving('up'));
arrowDown.addEventListener('mousedown', () => startMoving('down'));
arrowUp.addEventListener('touchstart', () => startMoving('up'));
arrowDown.addEventListener('touchstart', () => startMoving('down'));

document.addEventListener('mouseup', stopMoving);
document.addEventListener('touchend', stopMoving);

soundToggle.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    soundToggle.textContent = isSoundOn ? '♪' : '♪̸';
});

themeToggle.addEventListener('click', () => {
    isDayMode = !isDayMode;
    appContainer.classList.toggle('night-mode');
    themeToggle.textContent = isDayMode ? '☀' : '☽';
});
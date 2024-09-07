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
let isDayMode = true;

function playShutterSound() {
    if (isSoundOn && !isMoving) {
        shutterSound.currentTime = 0;
        const playPromise = shutterSound.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isMoving = true;
            }).catch(error => {
                console.log('Playback prevented. Reason:', error);
            });
        }
    }
}

function stopShutterSound() {
    shutterSound.pause();
    shutterSound.currentTime = 0;
    isMoving = false;
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
        stopShutterSound();
        clearInterval(moveInterval);
    }
}

function startMoving(direction) {
    clearInterval(moveInterval);
    moveInterval = setInterval(() => moveShutter(direction), 16);
}

function stopMoving() {
    clearInterval(moveInterval);
    stopShutterSound();
}

function handleTouchStart(direction) {
    startMoving(direction);
    event.preventDefault(); // iOSの拡大鏡を防止
}

function handleTouchEnd() {
    stopMoving();
    event.preventDefault(); // iOSの拡大鏡を防止
}

arrowUp.addEventListener('mousedown', () => startMoving('up'));
arrowDown.addEventListener('mousedown', () => startMoving('down'));
arrowUp.addEventListener('touchstart', () => handleTouchStart('up'));
arrowDown.addEventListener('touchstart', () => handleTouchStart('down'));

document.addEventListener('mouseup', stopMoving);
document.addEventListener('touchend', handleTouchEnd);

soundToggle.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    soundToggle.textContent = isSoundOn ? '♪' : '♪̸';
});

themeToggle.addEventListener('click', () => {
    isDayMode = !isDayMode;
    appContainer.classList.toggle('night-mode');
    themeToggle.textContent = isDayMode ? '☀' : '☽';
});

// iOS Safariでの自動再生制限に対処
document.addEventListener('touchstart', function() {
    if (shutterSound.paused) {
        shutterSound.play().then(() => {
            shutterSound.pause();
            shutterSound.currentTime = 0;
        }).catch(error => {
            console.log('Playback prevented. Reason:', error);
        });
    }
}, { once: true });

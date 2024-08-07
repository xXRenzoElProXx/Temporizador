let totalTime;
let timerInterval;
let alarmInterval;
let running = false;
let paused = false;

const timeDisplay = document.getElementById("time-display");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const continueButton = document.getElementById("continue-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const alarmSound = document.getElementById("alarm-sound");

function startTimer() {
    if (!running) {
        let hours = parseInt(hoursInput.value) || 0;
        let minutes = parseInt(minutesInput.value) || 0;
        let seconds = parseInt(secondsInput.value) || 0;
        totalTime = (hours * 3600) + (minutes * 60) + seconds;

        if (totalTime > 0) {
            updateTime();
            timerInterval = setInterval(decrementTime, 1000);
            running = true;
            paused = false;
            toggleButtons('start');
        }
    }
}

function pauseTimer() {
    if (running && !paused) {
        clearInterval(timerInterval);
        paused = true;
        toggleButtons('pause');
    }
}

function continueTimer() {
    if (running && paused) {
        timerInterval = setInterval(decrementTime, 1000);
        paused = false;
        toggleButtons('continue');
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(alarmInterval);
    alarmSound.pause();
    alarmSound.currentTime = 0;
    running = false;
    paused = false;
    totalTime = 0;
    timeDisplay.textContent = "00:00:00";
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    updatePageTitle();
    toggleButtons('stop');
}

function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(alarmInterval);
    alarmSound.pause();
    alarmSound.currentTime = 0;

    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    totalTime = (hours * 3600) + (minutes * 60) + seconds;
    updateTime();

    if (running && paused) {
        timerInterval = setInterval(decrementTime, 1000);
        paused = false;
        toggleButtons('pause');
    } else if (running) {
        timerInterval = setInterval(decrementTime, 1000);
        toggleButtons('start');
    } else {
        toggleButtons('reset');
    }
}

function decrementTime() {
    if (totalTime <= 0) {
        clearInterval(timerInterval);
        running = false;
        alarmSound.play();
        alarmInterval = setInterval(() => {
            alarmSound.play();
        }, alarmSound.duration * 1000 + 2000);
        updatePageTitle();
        toggleButtons('end');
    } else {
        totalTime--;
        updateTime();
    }
}

function updateTime() {
    timeDisplay.textContent = formatTime(totalTime);
    updatePageTitle();
}

function updatePageTitle() {
    document.title = formatTime(totalTime) + " - Temporizador";
}

function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    return (
        (hours > 9 ? hours : "0" + hours) + ":" +
        (minutes > 9 ? minutes : "0" + minutes) + ":" +
        (secs > 9 ? secs : "0" + secs)
    );
}

function toggleButtons(state) {
    switch (state) {
        case 'start':
            startButton.style.display = 'none';
            pauseButton.style.display = 'inline-block';
            continueButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            resetButton.style.display = 'inline-block';
            break;
        case 'pause':
            pauseButton.style.display = 'inline-block';
            continueButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            resetButton.style.display = 'inline-block';
            startButton.style.display = 'none';
            break;
        case 'continue':
            pauseButton.style.display = 'inline-block';
            continueButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            resetButton.style.display = 'inline-block';
            startButton.style.display = 'none';
            break;
        case 'stop':
            startButton.style.display = 'inline-block';
            pauseButton.style.display = 'none';
            continueButton.style.display = 'none';
            stopButton.style.display = 'none';
            resetButton.style.display = 'none';
            break;
        case 'reset':
            startButton.style.display = 'inline-block';
            pauseButton.style.display = paused ? 'inline-block' : 'none';
            continueButton.style.display = 'none';
            stopButton.style.display = 'none';
            resetButton.style.display = 'inline-block';
            break;
        case 'end':
            startButton.style.display = 'none';
            pauseButton.style.display = 'none';
            continueButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            resetButton.style.display = 'inline-block';
            break;
    }
    startButton.disabled = !isValidTime();
}

function isValidTime() {
    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    return (hours > 0 || minutes > 0 || seconds > 0);
}

function handleInputChange() {
    startButton.disabled = !isValidTime();
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
continueButton.addEventListener("click", continueTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
hoursInput.addEventListener("input", handleInputChange);
minutesInput.addEventListener("input", handleInputChange);
secondsInput.addEventListener("input", handleInputChange);

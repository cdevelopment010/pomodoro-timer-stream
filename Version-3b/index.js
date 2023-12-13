const searchParams = new URLSearchParams(window.location.search);

const workTime = searchParams.has("workTime") ? searchParams.get("workTime")*60*1000 : 25*60*1000;
const restTime = searchParams.has("restTime") ? searchParams.get("restTime")*60*1000 : 5*60*1000;
const longRestTime = searchParams.has("longRestTime") ? searchParams.get("longRestTime")*60*1000 : null;
const intervalCount = searchParams.has("intervalCount") ? searchParams.get("intervalCount")*1 : Number.POSITIVE_INFINITY;
let numberWorkIntervals = intervalCount;
let intervalsCompleted = 0; 
let currentMode = "Work";
let time = workTime;
let interval;

const timer = document.querySelectorAll('.timer')[0];
const modeEl = document.querySelectorAll('.mode')[0];
const progress = document.querySelectorAll('.progress')[0];

updateCountdown(time);
countdown(time);

function countdown(pTime){
    interval = setInterval(() => {
        pTime -= 1000;
        if (pTime <= 0) {
            clearInterval(interval);
            intervalsCompleted  = currentMode == "Work" ? intervalsCompleted + 1 : intervalsCompleted;
            numberWorkIntervals = currentMode == "Work" ? numberWorkIntervals - 1 : numberWorkIntervals;
            if (numberWorkIntervals > 0){
                swapMode();
            }
        }
        updateCountdown(pTime);
    }, 1000)
}

function swapMode() {
    console.log(intervalsCompleted)
    currentMode = currentMode == "Work" && longRestTime && intervalsCompleted % 4 == 0 ? "Long Rest" 
                    : currentMode == "Work" && (intervalsCompleted % 4 != 0 || !longRestTime ) ? "Rest" : "Work";
    time = currentMode == "Work" ? workTime : 
            currentMode == "Long Rest" ? longRestTime : restTime;
    if (currentMode == "Work"){
        progress.classList.add('work')
        progress.classList.remove('rest')
    } else {
        progress.classList.remove('work')
        progress.classList.add('rest')
    }
    updateCountdown(time); 
    countdown(time);
}

function updateCountdown(pTime) {

    if (numberWorkIntervals <= 0) {
        progress.style.setProperty('--width', '100%');
        progress.classList.remove('work')
        progress.classList.add('rest')
        timer.innerText = "00:00";
        modeEl.innerText = "END";

    } else if (pTime == 0) {
        progress.style.setProperty('--width', '0%');
        
    } else {
        let width = (100 - (pTime / (currentMode == "Work" ? workTime : currentMode == "Long Rest" ? longRestTime : restTime) * 100) ) + '%';
        progress.style.setProperty('--width', width);
        let minutes = Math.floor(pTime / 60 / 1000).toString().padStart(2, "0"); 
        let seconds = ((pTime / 1000) % 60).toString().padStart(2,"0")
        timer.innerText = minutes + ":" + seconds;
        modeEl.innerText = currentMode;
    }
}

/* leaving this in for now. Might add functionality to pause later. */
// function play() {
//     clearInterval(interval);
//     countdown(time);
//     document.getElementsByClassName('pause')[0].classList.remove('d-none');
//     document.getElementsByClassName('play')[0].classList.add('d-none');
// }

// function pause() {
//     clearInterval(interval);
//     console.log(numberWorkIntervals);
//     let [minutes, seconds] = timer.innerText.split(":");
//     time = ((minutes * 60 ) + seconds * 1) * 1000;
//     document.getElementsByClassName('play')[0].classList.remove('d-none');
//     document.getElementsByClassName('pause')[0].classList.add('d-none');
// }

// function reset() {
//     currentMode = "Work";
//     numberWorkIntervals = intervalCount;
//     time = workTime;

    
//     document.getElementsByClassName('pause')[0].classList.remove('d-none');
//     document.getElementsByClassName('play')[0].classList.add('d-none');

//     clearInterval(interval);
//     updateCountdown(time);
//     countdown(time);

// }
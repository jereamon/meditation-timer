var innerContainerTop = document.querySelector('.inner-container.top'),
    innerContainerBottom = document.querySelector('.inner-container.bottom'),
    begin = document.querySelector('.begin'),
    clock = document.querySelector('.clock'),
    startP = document.querySelector('.start-p'),
    timeSelect = document.querySelector('.time-select'),
    radioLessThan = document.querySelector('.radio-less-than'),
    radioLessOrMore = document.querySelector('.radio-less-or-more'),
    startButton = document.querySelector('.start-button'),
    resetButton = document.querySelector('.reset-button'),
    stopAudio = document.querySelector('.stop-audio'),
    timerEndAudio = new Audio('yak_sounds_4_edit.wav');


begin.addEventListener('click', function () {
    innerContainerTop.style.display = 'none';
    innerContainerBottom.style.display = 'flex'
    innerContainerBottom.style.visibility = 'visible'
    innerContainerBottom.style.height = '66vh';

    var timerRunning = false,
        timerHasRun = false;
    var countInterval;
    // var timeLeft = getTimerTime(),
    var timeLeft = [0, 5];

    clock.innerText = '8:00';

    function getTimerTime() {
        // if (document.activeElement.classList[0] == 'time-select') {
        //     console.log('time changed, time select active')
        // }

        if (timeSelect.value < 0) {
            timeSelect.value = 1;
        } if (!(timeSelect.value % 1 === 0)) {
            timeSelect.value = Math.floor(timeSelect.value)
        }

        if (radioLessThan.checked) {
            timeMultiplier = Math.round(100 * (Math.random() * (1 - 0.89) + 0.89)) / 100
            totalTime = timeSelect.value * timeMultiplier
            totalMinutes = Math.floor(totalTime)
            totalSeconds = Math.round((totalTime - Math.floor(totalTime)) * 60)
        } else if (radioLessOrMore.checked) {
            timeMultiplier = Math.round(100 * (Math.random() * (1.11 - 0.89) + 0.89)) / 100
            totalTime = timeSelect.value * timeMultiplier
            totalMinutes = Math.floor(totalTime)
            totalSeconds = Math.round((totalTime - Math.floor(totalTime)) * 60)
        } else {
            totalMinutes = timeSelect.value;
            totalSeconds = '00';
        }

        if (totalSeconds > 0 && totalSeconds < 10) {
            totalSeconds = '0' + totalSeconds.toString()
        } else if (totalSeconds === 0) {
            totalSeconds = '00';
        }

        return [totalMinutes, totalSeconds]
    }

    timeSelect.addEventListener('input', function () {
        if (!timerRunning) {
            timeLeft = getTimerTime()
            clock.innerText = timeLeft[0] + ':' + timeLeft[1];
        }
    })

    startButton.addEventListener('click', function () {
        if (timerRunning) {
            clearInterval(countInterval)
            startButton.innerText = 'Start Timer'
            timerRunning = false

            clock.classList.remove('running')
        } else if (!timerRunning) {
            if (!timerHasRun) {
                timerHasRun = true
            }

            startButton.innerText = 'Stop Timer'
            clock.classList.add('running');

            countInterval = setInterval(function () {
                if (timeLeft[1] <= 0) {
                    timeLeft[0] -= 1;
                    timeLeft[1] = 59;
                } else {
                    timeLeft[1] -= 1;
                }

                clock.innerText = timeLeft[0] + ':' + timeLeft[1]

                if ((timeLeft[0] <= 0 && timeLeft[1] <= 0) || timeLeft[0] < 0) {
                    clearInterval(countInterval)

                    startButton.innerText = 'Start Timer'
                    clock.innerText = '0:00';

                    var audioToggle = true;
                    stopAudio.style.visibility = 'visible';
                    
                    timerEndAudio.play();

                    timerEndAudio.addEventListener('ended', function() {
                        this.currentTime = 0;
                        this.play();
                    }, false)

                    stopAudio.addEventListener('click', function() {
                        if (audioToggle) {
                            timerEndAudio.pause();
                            audioToggle = false;
                        } else {
                            timerEndAudio.play();
                            audioToggle = true;
                        }
                        
                    })
                }
            }, 1000)

            timerRunning = true
        }

    })

    resetButton.addEventListener('click', function () {
        if (timerRunning) {
            clearInterval(countInterval)
            timerRunning = false
            startButton.innerText = 'Start Timer'
        }

        timerHasRun = false
        timeLeft = getTimerTime()
        clock.innerText = timeLeft[0] + ':' + timeLeft[1]

        stopAudio.style.visibility = 'hidden';
    })

    radioLessThan.addEventListener('change', function() {
        if (!timerRunning && !timerHasRun) {
            timeLeft = getTimerTime()
            clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        }
    })

    radioLessOrMore.addEventListener('change', function() {
        if (!timerRunning && !timerHasRun) {
            timeLeft = getTimerTime()
            clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        }
    })
})
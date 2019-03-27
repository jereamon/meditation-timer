var innerContainerTop = document.querySelector('.inner-container.top'),
    innerContainerBottom = document.querySelector('.inner-container.bottom'),
    begin = document.querySelector('.begin'),
    clock = document.querySelector('.clock'),
    startP = document.querySelector('.start-p'),
    timeSelect = document.querySelector('.time-select'),
    radioLessThan = document.querySelector('.radio-less-than'),
    radioLessOrMore = document.querySelector('.radio-less-or-more'),
    radioEqualTo = document.querySelector('.radio-equal-to'),
    startButton = document.querySelector('.start-button'),
    resetButton = document.querySelector('.reset-button'),
    showHideTimer = document.querySelector('.show-hide-timer'),
    showHideTimerText = document.querySelector('.show-hide-timer-text'),
    stopAudio = document.querySelector('.stop-audio'),
    timerEndAudio = new Audio('yak_sounds_4_edit_2.wav');


begin.addEventListener('click', function () {
    innerContainerTop.style.display = 'none';
    innerContainerBottom.style.display = 'flex'
    innerContainerBottom.style.visibility = 'visible'
    innerContainerBottom.style.height = '66vh';

    var timerRunning = false,
        timerHasRun = false;
    var countInterval;
    // var totalTime = getTotalSeconds();
    var totalTime = 15;
    var secondsLeft = totalTime;
    var timeLeft = formatTimeLeft(secondsLeft);
    var timePassed = 0;
    var secondsElapsed = 0;
    var stopAudioListenerBool = false;
    var audioToggle = false;

    clock.innerText = '8:00';

    function formatTimeLeft(seconds) {
        totalMinutes = Math.floor(seconds / 60)
        totalSeconds = Math.round(60 * (Math.round(100 * ((seconds / 60) - Math.floor(seconds / 60))) / 100))

        if (totalSeconds > 0 && totalSeconds < 10) {
            totalSeconds = '0' + totalSeconds.toString()
        } else if (totalSeconds === 0) {
            totalSeconds = '00';
        }

        return [totalMinutes, totalSeconds]
    }

    function getTotalSeconds() {
        if (timeSelect.value < 0) {
            timeSelect.value = 1;
        } if (!(timeSelect.value % 1 === 0)) {
            timeSelect.value = Math.floor(timeSelect.value)
        }

        if (radioLessThan.checked) {
            timeMultiplier = Math.round(100 * (Math.random() * (1 - 0.89) + 0.89)) / 100
            totalSeconds = Math.round((timeSelect.value * timeMultiplier) * 60)

        } else if (radioLessOrMore.checked) {
            timeMultiplier = Math.round(100 * (Math.random() * (1.11 - 0.89) + 0.89)) / 100
            totalSeconds = Math.round((timeSelect.value * timeMultiplier) * 60)
        } else {
            totalSeconds = Math.round(timeSelect.value * 60)
        }

        return totalSeconds
    }

    function setClockText(end = false) {
        if (end) {
            clock.style.fontSize = '3rem';
            clock.innerText = 'timer ended'
        } else {
            if (!showHideTimer.checked) {
                clock.innerText = timeLeft[0] + ':' + timeLeft[1]
                showHideTimerText.innerText = 'Hide Timer'
                clock.style.fontSize = '5rem';
            } else {
                showHideTimerText.innerText = 'Show Timer'
                clock.style.fontSize = '3rem';

                if (timerRunning) {
                    clock.innerText = 'timer running'
                } else {
                    clock.innerText = 'timer hidden'
                }
            }
        }
    }

    timeSelect.addEventListener('input', function () {
        if (!timerRunning) {
            totalTime = getTotalSeconds()
            timeLeft = formatTimeLeft(totalTime)

            setClockText()
        }
    })

    startButton.addEventListener('click', function () {
        if (timerRunning) {
            clearInterval(countInterval)
            startButton.innerText = 'Start Timer'
            timerRunning = false

            clock.classList.remove('running')
            setClockText();

            if (audioToggle) {
                timerEndAudio.pause()
                audioToggle = false;
            }
        } else if (!timerRunning) {
            if (!timerHasRun) {
                timerHasRun = true
            } else {
                timePassed += secondsElapsed
            }

            startButton.innerText = 'Stop Timer'
            clock.classList.add('running');

            var startTime = Date.now()

            countInterval = setInterval(function () {
                var timeElapsed = Date.now() - startTime;

                secondsElapsed = Math.round(timeElapsed / 1000);

                secondsLeft = totalTime - (secondsElapsed + timePassed);

                timeLeft = formatTimeLeft(secondsLeft)
                setClockText()

                if (secondsLeft <= 10 && !audioToggle) {
                    // timerEndAudio.currentTime = 0;
                    timerEndAudio.play();
                    audioToggle = true;

                } else if (secondsLeft <= 0) {
                    console.log('timer ended')
                    clearInterval(countInterval)

                    startButton.innerText = 'Start Timer'
                    // clock.innerText = '0:00';
                    setClockText(true)


                    stopAudio.style.display = 'block';

                    timerEndAudio.addEventListener('ended', function () {
                        this.currentTime = 0;
                        this.play();
                    }, false)

                    if (!stopAudioListenerBool) {
                        stopAudioListenerBool = true;

                        stopAudio.addEventListener('click', function () {
                            console.log('clicked stopAudio audioToggle: ' + audioToggle)
                            if (audioToggle) {
                                timerEndAudio.pause();
                                audioToggle = false;
                            } else {
                                timerEndAudio.play();
                                audioToggle = true;
                            }

                        })
                    }

                    timerRunning = false
                }
            }, 200)

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
        timeLeft = formatTimeLeft(totalTime)
        timePassed = 0;

        // clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        setClockText();
        stopAudio.style.display = 'none';
        if (audioToggle) {
            timerEndAudio.pause();
            audioToggle = false
        }

        timerEndAudio.currentTime = 0;
        console.log('audioToggle: ', audioToggle)
    })

    radioLessThan.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            totalTime = getTotalSeconds()
            timeLeft = formatTimeLeft(totalTime)
            // clock.innerText = timeLeft[0] + ':' + timeLeft[1]
            setClockText();
        }
    })

    radioLessOrMore.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            totalTime = getTotalSeconds()
            timeLeft = formatTimeLeft(totalTime)

            // clock.innerText = timeLeft[0] + ':' + timeLeft[1]
            setClockText();
        }
    })

    radioEqualTo.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            totalTime = getTotalSeconds()
            timeLeft = formatTimeLeft(totalTime)

            // clock.innerText = timeLeft[0] + ':' + timeLeft[1]
            setClockText();
        }
    })

    showHideTimer.addEventListener('change', function () {
        setClockText()
    })
})
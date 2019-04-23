// Lots of variables to initialize
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


// Ok. The page to start just shows some explanatory text.
// This event listener on the Begin button starts it all.

// It hides the initial screen and shows the timer and its selection options.
begin.addEventListener('click', function () {
    innerContainerTop.style.display = 'none';
    innerContainerBottom.style.display = 'flex'
    innerContainerBottom.style.visibility = 'visible'
    innerContainerBottom.style.height = '66vh';

    // Initialize some more variables.
    var timerRunning = false,
        timerHasRun = false;
    var countInterval;
    var totalTime = getTotalSeconds();

    // This totalTime setting is for testing
    // var totalTime = 15;

    // I think I have some redundancy here with totalTime and secondsLeft.
    var secondsLeft = totalTime;

    // Takes total seconds and turns it into mintues and seconds.
    var timeLeft = formatTimeLeft(secondsLeft);

    var timePassed = 0;
    var secondsElapsed = 0;

    var stopAudioListenerBool = false;
    var audioToggle = false;
    var beenReset = false;

    // Clock always initializes at eight minutes.
    clock.innerText = '8:00';

    function formatTimeLeft(seconds) {
        /** This takes seconds and returns it formatted as minutes and seconds
         * as individual items in an array.
         */

        if (seconds < 0) {
            totalMinutes = Math.ceil(seconds / 60)

            if (totalMinutes == 0) {
                totalMinutes = '-' + totalMinutes.toString()
            }

            totalSeconds = Math.abs(Math.round(60 * (Math.round(100 * ((seconds / 60) - Math.ceil(seconds / 60))) / 100)))
        } else {
            totalMinutes = Math.floor(seconds / 60)
            totalSeconds = Math.round(60 * (Math.round(100 * ((seconds / 60) - Math.floor(seconds / 60))) / 100))
        }

        if (totalSeconds >= 0 && totalSeconds < 10) {
            totalSeconds = '0' + totalSeconds.toString()
        }

        return [totalMinutes, totalSeconds]
    }

    function getTotalSeconds() {
        /** Uses the value in timeSelect to convert minutes to total seconds.
         * The returned value will vary based on whether any time modifier has
         * been selected by the user.
         */

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

    function setClockText() {
        /** This sets the time the user sees in clock based of the global
         * variable timeLeft.
         */

        // if (end) {
        //     clock.style.fontSize = '3rem';
        //     clock.innerText = 'timer ended'
        // } else {
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
        // }
    }

    function startTimer() {
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
                if (secondsLeft <= 10 && !audioToggle && !stopAudioListenerBool) {
                    checkTimeLeft()
                }
            }, 200)

            timerRunning = true
        }
    }

    function checkTimeLeft() {
        // timerEndAudio.currentTime = 0;
        timerEndAudio.play();
        audioToggle = true;

        stopAudio.style.display = 'block';

        timerEndAudio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false)

        if (!stopAudioListenerBool && !beenReset) {
            stopAudioListenerBool = true;

            stopAudio.addEventListener('click', function () {
                console.log('clicked stopAudio audioToggle: ' + audioToggle)
                if (audioToggle) {
                    timerEndAudio.pause();
                    audioToggle = false;
                    startTimer()
                } else {
                    timerEndAudio.play();
                    audioToggle = true;
                    startTimer()
                }

            })
        }
    }

    timeSelect.addEventListener('input', function () {
        /** Updates the clock display if a user changes the selected time. */

        if (!timerRunning) {
            totalTime = getTotalSeconds()
            timeLeft = formatTimeLeft(totalTime)

            setClockText()
        }
    })

    startButton.addEventListener('click', function () {
        startTimer()
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
            stopAudioListenerBool = false
        }

        timerEndAudio.currentTime = 0;
        beenReset = true
        stopAudioListenerBool = false
        console.log('audioToggle: ', audioToggle + '\n stopAudioListenerBool: ' + stopAudioListenerBool)
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
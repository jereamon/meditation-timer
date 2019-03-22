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
    // var timeLeft = getTimerTime();
    var totalTime = getTotalSeconds();
    var secondsLeft = totalTime;
    var timeLeft = formatTimeLeft(secondsLeft);
    var timePassed = 0;
    var secondsElapsed = 0;

    console.log('Initalizing timeLeft. Total Seconds: ' + getTotalSeconds())
    console.log('initializing total time. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))
    // var timeLeft = [0, 12];

    clock.innerText = '8:00';

    function getTimerTime() {
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

    timeSelect.addEventListener('input', function () {
        if (!timerRunning) {
            timeLeft = getTimerTime()
            totalTime = getTotalSeconds()
            console.log('Time select change. Total Seconds: ' + totalTime)
            console.log('Time select change. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))
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
            } else {
                timePassed += secondsElapsed
                // secondsLeft = totalTime - timePassed
                console.log(timePassed)
            }

            startButton.innerText = 'Stop Timer'
            clock.classList.add('running');

            var startTime = Date.now()

            countInterval = setInterval(function () {
                var timeElapsed = Date.now() - startTime;
                    
                secondsElapsed = Math.round(timeElapsed / 1000);

                secondsLeft = totalTime - (secondsElapsed + timePassed);
            
                timeLeft = formatTimeLeft(secondsLeft)

                clock.innerText = timeLeft[0] + ':' + timeLeft[1]

                if ((timeLeft[0] <= 0 && timeLeft[1] <= 0) || timeLeft[0] < 0) {
                    clearInterval(countInterval)

                    startButton.innerText = 'Start Timer'
                    clock.innerText = '0:00';

                    var audioToggle = true;
                    stopAudio.style.display = 'block';

                    timerEndAudio.play();

                    timerEndAudio.addEventListener('ended', function () {
                        this.currentTime = 0;
                        this.play();
                    }, false)

                    stopAudio.addEventListener('click', function () {
                        if (audioToggle) {
                            timerEndAudio.pause();
                            audioToggle = false;
                        } else {
                            timerEndAudio.play();
                            audioToggle = true;
                        }

                    })
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
        timeLeft = getTimerTime()
        totalTime = getTotalSeconds()
        timePassed = 0;

        console.log('Reset Button. Total Seconds: ' + totalTime)
        console.log('Reset Button. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))

        clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        stopAudio.style.display = 'none';
        timerEndAudio.pause();
    })

    radioLessThan.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            timeLeft = getTimerTime()
            totalTime = getTotalSeconds()
            console.log('RadioLessThan Change. Total Seconds: ' + totalTime)
            console.log('RadioLessThan Change. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))
            clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        }
    })

    radioLessOrMore.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            timeLeft = getTimerTime()
            totalTime = getTotalSeconds()
            console.log('RadioLessOrMore Change. Total Seconds: ' + totalTime)
            console.log('RadioLessOrMore Change. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))
            clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        }
    })

    radioEqualTo.addEventListener('change', function () {
        if (!timerRunning && !timerHasRun) {
            timeLeft = getTimerTime()
            totalTime = getTotalSeconds()
            console.log('RadioEqualTo Change. Total Seconds: ' + totalTime)
            console.log('RadioEqualTo Change. Formatted minutes & seconds: ' + formatTimeLeft(totalTime))
            clock.innerText = timeLeft[0] + ':' + timeLeft[1]
        }
    })
})
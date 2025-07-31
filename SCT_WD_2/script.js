class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.interval = null;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.millisecondsElement = document.getElementById('milliseconds');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        
        this.lapList = document.getElementById('lapList');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.lap());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.interval = setInterval(() => this.updateDisplay(), 10);
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.elapsedTime = Date.now() - this.startTime;
            
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
        }
    }
    
    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.updateDisplay();
        this.updateLapList();
    }
    
    lap() {
        if (this.isRunning) {
            const currentTime = this.getCurrentTime();
            const lapTime = {
                number: this.lapTimes.length + 1,
                time: currentTime,
                totalTime: this.elapsedTime
            };
            
            this.lapTimes.push(lapTime);
            this.updateLapList();
        }
    }
    
    updateDisplay() {
        const time = this.getCurrentTime();
        
        this.hoursElement.textContent = this.padZero(time.hours);
        this.minutesElement.textContent = this.padZero(time.minutes);
        this.secondsElement.textContent = this.padZero(time.seconds);
        this.millisecondsElement.textContent = this.padZero(time.milliseconds);
    }
    
    getCurrentTime() {
        const totalMilliseconds = this.isRunning ? 
            Date.now() - this.startTime : this.elapsedTime;
        
        const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
        
        return { hours, minutes, seconds, milliseconds };
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    updateLapList() {
        this.lapList.innerHTML = '';
        
        if (this.lapTimes.length === 0) {
            this.lapList.innerHTML = '<div class="lap-item">No lap times recorded</div>';
            return;
        }
        
        this.lapTimes.forEach((lap, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `#${lap.number}`;
            
            const lapTime = document.createElement('span');
            lapTime.className = 'lap-time';
            lapTime.textContent = this.formatTime(lap.time);
            
            const lapDifference = document.createElement('span');
            lapDifference.className = 'lap-difference';
            
            if (index > 0) {
                const difference = lap.totalTime - this.lapTimes[index - 1].totalTime;
                const diffTime = this.formatTime(this.millisecondsToTime(difference));
                lapDifference.textContent = `+${diffTime}`;
            } else {
                lapDifference.textContent = '--';
            }
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTime);
            lapItem.appendChild(lapDifference);
            
            this.lapList.appendChild(lapItem);
        });
    }
    
    formatTime(time) {
        const hours = this.padZero(time.hours);
        const minutes = this.padZero(time.minutes);
        const seconds = this.padZero(time.seconds);
        const milliseconds = this.padZero(time.milliseconds);
        
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    millisecondsToTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        return { hours, minutes, seconds, milliseconds: ms };
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const stopwatch = new Stopwatch();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (stopwatch.isRunning) {
                    stopwatch.pause();
                } else {
                    stopwatch.start();
                }
                break;
            case 'KeyL':
                if (stopwatch.isRunning) {
                    stopwatch.lap();
                }
                break;
            case 'KeyR':
                stopwatch.reset();
                break;
        }
    });
}); 
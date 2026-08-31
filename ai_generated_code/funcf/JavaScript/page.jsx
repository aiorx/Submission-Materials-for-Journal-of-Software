```javascript
const timerInterval = setInterval(() => {

    const endTime = timeStarted + selectedMinutes * 60_000;
    const timeDifference = endTime - Date.now();
    const newTime = new Date(timeDifference);
    const newClockValue = `${newTime.getMinutes()}:${newTime.getSeconds().toString().padStart(2, "0")}`;
    
    setClockValue(newClockValue);

    if (initialClockValue == null) {
        setInitialClockValue(newClockValue);
    }

    if (newTime.getMinutes() == 0 && newTime.getSeconds() == 0) {
        showResults();
        return;
    }

}, 1000);
```

```javascript
const stopwatchInterval = setInterval(() => {
    const timeDifference = Date.now() - timeStarted;
    const totalMinutes = Math.floor(timeDifference / 60_000);
    const seconds = Math.floor((timeDifference % 60_000) / 1000);
    const newClockValue = `${totalMinutes}:${seconds.toString().padStart(2, "0")}`;
    setClockValue(newClockValue);

}, 1000);
```
```js
const scrambleInterval = setInterval(() => {
    this.buttons.forEach((button) => {
        const x = Math.random() * (window.innerWidth - 150); // Random position within window width
        const y = Math.random() * (window.innerHeight - 100); // Random position within window height
        button.setPosition(x, y);
    });
    remainingTimes--;
    if (remainingTimes === 0) {
        clearInterval(scrambleInterval);
        // Enable interaction after scrambling is complete
        this.enableInteraction(); 
        this.hideNumbers()
    }
}, 2000);
```
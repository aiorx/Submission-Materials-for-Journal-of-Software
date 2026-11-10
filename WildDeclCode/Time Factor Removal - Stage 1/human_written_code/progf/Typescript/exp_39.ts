// L1
console.log('🥪 Synchronous 1');

// L2
setTimeout(function _ { return console.log("🍅 Timeout 2"); }, 0);

// L3
Promise.resolve().then(function _ { return console.log('🍍 Promise 3'); });

// L4
console.log('🥪 Synchronous 4');

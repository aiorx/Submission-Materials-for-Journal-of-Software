```js
commander.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', commander.args.join(' '));

    process.exit(1);
});
```
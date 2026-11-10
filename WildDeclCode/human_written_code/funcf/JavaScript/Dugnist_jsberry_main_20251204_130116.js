```js
// Help text output
function usage() {
    const usageText = `
usage:
    jsberry <command> <name> <type>

    commands can be:

    new:      used to create a new jsberry project
    i:        used to install plugins or modules from store
    un:       used to uninstall plugins or modules from project
    help:     used to print the usage guide

    for example:

    jsberry new my-project
    jsberry i express_api plugin
    jsberry i clear module
    `;

    console.log(usageText);
};
```
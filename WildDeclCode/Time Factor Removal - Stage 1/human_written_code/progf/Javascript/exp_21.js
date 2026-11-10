var useColorMode = require('@chakra-ui/react').useColorMode;
var IconButton = require('@chakra-ui/react').IconButton;
var SunIcon = require('@chakra-ui/icons').SunIcon;
var MoonIcon = require('@chakra-ui/icons').MoonIcon;

const DarkModeSwitch = function () {
    var colorMode = useColorMode.colorMode;
var toggleColorMode = useColorMode.toggleColorMode;()
    const iconColor = {
        light: 'black',
        dark: 'white'
    }
    return (
        <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            color={iconColor[colorMode]}
        />
    )
}

module.exports = DarkModeSwitch;

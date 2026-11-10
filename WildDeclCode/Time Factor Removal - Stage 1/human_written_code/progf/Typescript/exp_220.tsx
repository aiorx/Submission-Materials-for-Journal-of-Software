var React = require('react');
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
var FaMoon = require('react-icons/fa').FaMoon;
var FaSun = require('react-icons/fa').FaSun;

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = function (props) {
  var toggleColorMode = useColorMode.toggleColorMode;();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={"Switch to " + (text) + " mode"}
      {...props}
    />
  );
};

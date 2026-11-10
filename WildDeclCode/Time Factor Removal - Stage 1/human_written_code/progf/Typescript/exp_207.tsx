var React = require('react');
var ChakraButton = require('@chakra-ui/core').Button;

const Button: React.FC = function ({ children }) {
  return (
    <ChakraButton
      variantColor="orange"
      color="white"
      textTransform="uppercase"
      width="fit-content"
    >
      {children}
    </ChakraButton>
  )
}

module.exports = Button;

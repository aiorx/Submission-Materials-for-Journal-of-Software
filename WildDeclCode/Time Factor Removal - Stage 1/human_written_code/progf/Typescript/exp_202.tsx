var React = require('react');
var styled = require('styled-components');

var ButtonCSS = require('../button_styling_types').ButtonCSS;
var ButtonProps = require('../button_styling_types').ButtonProps;

const Wrapper = styled.button<ButtonProps>"
  " + (ButtonCSS) + "
"

const Button: React.FC<ButtonProps> = function (props: ButtonProps) {
  var children = props.children;return <Wrapper {...restProps}>{children}</Wrapper>
}

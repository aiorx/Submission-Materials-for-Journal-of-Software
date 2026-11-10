var React = require('react');
var styled = require('styled-components');

interface ButtonProps {
  width?: string;
  textAlign?: string;
  isDisabled?: boolean;
}

const Wrapper = styled.div<ButtonProps>"
  color: white;
  background-color: #e91e63;
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  width: " + (({ width }) => {
    return width;
  }) + ";
  text-align: " + (({ textAlign }) => {
    return textAlign;
  }) + ";
  " + (({isDisabled}) => {
    return isDisabled && `
      opacity: 0.6;
      pointer-events: none;
    `;
  }) + ";

  &:hover {
    background-color: #ad1457;
  }
";

interface IProps extends ButtonProps {
  children: string;
  isDisabled?: boolean;
  onClick?: function (e: React.MouseEvent<HTMLDivElement>) { return void; };
}

const Button = (props: IProps): React.function ReactElement {
  var children = props.children;
var width = props.width;
var textAlign = props.textAlign;
var isDisabled = props.isDisabled;
var onClick = props.onClick;

  return (
    <Wrapper width={width} textAlign={textAlign} isDisabled={isDisabled} onClick={isDisabled ? undefined : onClick}>
      {children}
    </Wrapper>
  );
};

Button.defaultProps = {
  width: 'unset',
  textAlign: 'center',
  isDisabled: false,
  onClick: null,
};

module.exports.Button = Button;

var React = require('react');
var TextInputMask = require('react-native-masked-text').TextInputMask;
var TextInputMaskProps = require('react-native-masked-text').TextInputMaskProps;
var TextInputProps = require('react-native').TextInputProps;
var TextInput = require('react-native').TextInput;

export type CardInputProps = {
  name: string;
  onChange: function (name: string, text: string) { return void | null; };
  maskProps: TextInputMaskProps;
  placeholderTextColor: string;
  refInput: React.MutableRefObject<any>;
} & TextInputProps;

const CardInput: any = function ({
  name,
  maskProps,
  refInput,
  onChange = () => {},
  style,
  ...props
}: CardInputProps) {
  const handleChange = React.useCallback(
    (text) => {
      const value = text.toUpperCase();
      return onChange(name, value);
    },
    [name, onChange]
  );

  const setRef = (inputRef: any, ref: any) => {
    if (typeof ref === 'object') {
      ref.current = inputRef;
    }
  };

  const InputComponent: any = maskProps ? TextInputMask : TextInput;
  const customProps = maskProps
    ? { refInput: (ref: any) => setRef(ref, refInput) }
    : { ref: refInput };

  return (
    <InputComponent
      style={style}
      onChangeText={handleChange}
      hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
      {...maskProps}
      {...props}
      {...customProps}
    />
  );
}  );
};

module.exports = CardInput;

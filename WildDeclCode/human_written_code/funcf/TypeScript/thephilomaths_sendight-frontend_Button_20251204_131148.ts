```tsx
const Button = (props: IProps): React.ReactElement => {
  const { children, width, textAlign, isDisabled, onClick } = props;

  return (
    <Wrapper width={width} textAlign={textAlign} isDisabled={isDisabled} onClick={isDisabled ? undefined : onClick}>
      {children}
    </Wrapper>
  );
};
```
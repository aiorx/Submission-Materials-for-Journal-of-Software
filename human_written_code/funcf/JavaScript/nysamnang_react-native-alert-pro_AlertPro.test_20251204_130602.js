```js
it("should render correctly with no props", () => {
  const wrapper = shallow(<AlertPro />);
  expect(wrapper).toMatchSnapshot();
});
```
```typescript
it("circle slider should render a svg", () => {
    const circleSlider = shallow(<CircleSlider {...props} />);

    expect(circleSlider.find("svg")).toHaveLength(1);
});
```
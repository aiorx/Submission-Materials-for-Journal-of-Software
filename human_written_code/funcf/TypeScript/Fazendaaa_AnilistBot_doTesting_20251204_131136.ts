```typescript
const localeTesting = ({ locale, mocks, ...remaining }: LocaleToBeTested): void => {
    describe(locale, () => mocks.map(input => doTheTest({ locale, mocks, ...remaining, ...input })));
};
```
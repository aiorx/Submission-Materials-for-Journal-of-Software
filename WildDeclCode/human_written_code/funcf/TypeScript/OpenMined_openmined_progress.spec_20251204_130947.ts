```typescript
before(() => {
  cy.visit('/');
  cy.createUser(TEST_USER_02);
});
```
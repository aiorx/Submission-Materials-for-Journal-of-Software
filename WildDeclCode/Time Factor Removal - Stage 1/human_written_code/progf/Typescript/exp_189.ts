var TEST_ADDRESS_NEVER_USE_SHORTENED = require('../support/commands').TEST_ADDRESS_NEVER_USE_SHORTENED;

describe('Landing Page', function () {
  beforeEach(() => cy.visit('/'))
  it('loads swap page', () => {
    cy.get('#swap-page')
  })

  it('redirects to url /swap', () => {
    cy.url().should('include', '/swap')
  })

  it('allows navigation to pool', () => {
    cy.get('#pool-nav-link').click()
    cy.url().should('include', '/pool')
  })

  // Wallet not connected - test will not pass.
  // it('is connected', () => {
  //   cy.get('#web3-status-connected').click()
  //   cy.get('#web3-account-identifier-row').contains(TEST_ADDRESS_NEVER_USE_SHORTENED)
  // })
})

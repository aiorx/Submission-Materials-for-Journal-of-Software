const getHeading = function () { return cy.get('h1'); };

const getCookies = function () { return cy.get('div#cookies').as('cookies'); };

const getNavbar = function () { return cy.get('nav'); };

const getLink = function () { return cy.get('a.chakra-link'); };

const getButton = function () { return cy.get('button.chakra-button'); };

const getInput = function (name: string) { return cy.get("input[name='" + (name) + "']"); };

const getNextButton = function () { return cy.get('button.chakra-button').contains('Next'); };

const withBaseUrl = function (path?) { return Cypress.config().baseUrl + (path ? path : ''); };

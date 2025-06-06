// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// prihlasovanie „cez UI“
// Cypress.Commands.add("loginByUI", () => {
//     cy.visit("/login");
//     cy.get('input[name="email"]').type("kubis.jozef@outlook.com");
//     cy.get('input[name="password"]').type("111111");
//     cy.get('button[type="submit"]').click();
//     cy.location("pathname").should("eq", "/profiles");
// });

Cypress.Commands.add("loginByUI", () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('PASSWORD'), { log: false });
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');

});
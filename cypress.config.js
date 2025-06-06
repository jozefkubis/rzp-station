// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'f4pa6v',

  e2e: {
    baseUrl: 'https://rzp-rajec.vercel.app',

    // (1) globálne timeouty – voliteľné
    defaultCommandTimeout: 8000, // 8 sekúnd na každý cy.get/assert
    pageLoadTimeout: 60000,      // 60 s na načítanie stránky

    // (2) cesta k support súboru (ak by si menil)
    supportFile: 'cypress/support/e2e.js',

    // (3) node event hooks – ak ich potrebuješ neskôr
    setupNodeEvents(on, config) {
      // napr. reporty, code-coverage, custom tasks …
    },
  },

  // (4) vypni videá na CI ak ťa spomaľujú
  video: false,
});

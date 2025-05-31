const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'f4pa6v',
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

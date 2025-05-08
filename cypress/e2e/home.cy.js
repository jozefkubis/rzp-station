// cypress/support/commands.js

// prihlasovanie „cez UI“
Cypress.Commands.add("loginByUI", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').type("kubis.jozef@outlook.com");
  cy.get('input[name="password"]').type("111111");
  cy.get('button[type="submit"]').click();
  cy.location("pathname").should("eq", "/");
});


describe("Home page (authenticated)", () => {
  beforeEach(() => {
    // raz zalogovať a potešiť sa z кешovania session
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    // teraz už prehliadač *má* cookie, takže SSR pustí stránku
    cy.visit("/");
  });

  it("klikne na Kalendár", () => {
    cy.get('nav a[href="/calendar"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/calendar");
  });

  it("klikne na Profily", () => {
    cy.get('nav a[href="/profiles"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/profiles");
    cy.get(`[data-cy="profiles-page"]`).should("be.visible");
  });

  it("klikne na Profil", () => {
    cy.get('nav a[href="/settings/profile"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/settings/profile");
    cy.get(`[data-cy="settings-profile-page"]`).should("be.visible");
  });

  it("klikne na Registrácia", () => {
    cy.get('nav a[href="/register"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/register");
    cy.get(`[data-cy="register-page"]`).should("be.visible");
  });
});

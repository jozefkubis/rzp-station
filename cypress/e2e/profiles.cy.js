// cypress/e2e/profiles.cy.js

describe("Register page (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/profiles");
  });

  it("zobrazuje základné elementy stránky", () => {
    [
      "profiles-page",
      "profiles-title",
      "profiles-list",
      "user-card-avatar",
      "user-card-name",
      "user-card-email",
      "user-card-phone",
    ].forEach((sel) => {
      cy.get(`[data-cy="${sel}"]`).should("be.visible");
    });
  });

  it("klik na profil naviguje na detail a zobrazí edit button", () => {
    cy.get('[data-cy="user-card"]').first().click();

    // over URL
    cy.location("pathname")
      .should("match", /^\/profiles\/[0-9a-fA-F-]{36}$/);

    // počkaj, kým sa zobrazí tlačidlo
    cy.get('[data-cy="admin-edit-profile-button"]')
      .should("be.visible");
  });

  it("klik na upraviť, uložiť a navigácia späť", () => {
    // najprv detail
    cy.get('[data-cy="user-card"]').first().click();
    cy.get('[data-cy="admin-edit-profile-button"]').should("be.visible").click();

    // over URL edit stránky
    cy.location("pathname")
      .should("match", /^\/profiles\/[0-9a-fA-F-]{36}\/edit$/);

    // over, že je viditeľný formulár, klikni Uložiť
    cy.get('[data-cy="admin-update-profiles-data-form"]')
      .should("be.visible");
    cy.get('[data-cy="admin-update-profile-button"]')
      .should("be.visible")
      .click();

    // späť na detail
    cy.get('[data-cy="admin-back-to-profile-button"]')
      .should("be.visible")
      .click();
    cy.location("pathname")
      .should("match", /^\/profiles\/[0-9a-fA-F-]{36}$/);

    // späť na zoznam
    cy.get('[data-cy="admin-back-to-profiles-button"]')
      .should("be.visible")
      .click();
    cy.location("pathname").should("eq", "/profiles");
  });
});

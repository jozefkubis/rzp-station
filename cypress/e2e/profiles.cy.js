describe("Profiles page (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/profiles");
  });

  it("klik na upraviť profil", () => {
    // 1) Klik na prvú kartu používateľa
    cy.get('[data-cy="user-card"]').first().click();

    // 2) Počkať, kým sa na detail stránke objaví tlačidlo "Upraviť profil"
    cy.get('[data-cy="admin-edit-profile-button"]', { timeout: 8000 })
      .click();

    // 3) Teraz POČKAJ, kým sa zobrazí edit‐formulár (predvolene retry‐uje až 4s)
    cy.get('[data-cy="admin-update-profiles-data-form"]', { timeout: 8000 })
      .should("be.visible");

    // 4) Až potom over URL na /profiles/<uuid>/edit
    cy.location("pathname", { timeout: 8000 })
      .should("match", /^\/profiles\/[0-9a-fA-F-]{36}\/edit$/);

    // 5) (ďalšie kroky testu, napr. klik späť, overenie atď.)
    cy.get('[data-cy="admin-update-profile-button"]').click();
    cy.get('[data-cy="admin-back-to-profile-button"]').click();
    cy.location("pathname")
      .should("match", /^\/profiles\/[0-9a-fA-F-]{36}$/);
    cy.get('[data-cy="admin-back-to-profiles-button"]').click();
    cy.location("pathname").should("eq", "/profiles");
  });
});

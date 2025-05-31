describe("Settings/profile page (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/settings/profile");
  });

  it("zobrazuje nastavenia profilovehoho formulara", () => {
    cy.get('[data-cy="settings-profile-page"]').should("be.visible");
  })

  it("zobrazuje sa formular s funkcnym tlacidlom", () => {
    cy.get('[data-cy="admin-update-profiles-data-form"]').should("be.visible");

    cy.get('[data-cy="admin-update-profile-button"]').click();
  })

  it("zobrazuje sa sidebar s funkcnymi linkami", () => {
    cy.get('[data-cy="sidebar"]').should("be.visible");

    cy.contains('[data-cy="sidebar-link"]', "Informácie")
      .should("be.visible")
      .click();
    // cy.location("pathname").should("eq", "/settings/profile");

    cy.contains('[data-cy="sidebar-link"]', "Heslo")
      .should("be.visible")
      .click();
    cy.location("pathname").should("eq", "/settings/user");

  })
});

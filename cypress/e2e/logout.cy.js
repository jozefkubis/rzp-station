describe("Logout flow", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/");
  });

  it("odhlási používateľa a presmeruje na prihlasovaciu stránku", () => {
    cy.get('[data-cy="logout-button"]').click();
    cy.location("pathname").should("eq", "/login");
    cy.get('[data-cy="login-form"]').should("be.visible");
  });
});

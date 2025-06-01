
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
    cy.get('nav a[href="/calendar"]').click();
    cy.location("pathname").should("eq", "/calendar");
  });

  it("klikne na Profily", () => {
    cy.get('nav a[href="/profiles"]').click();
    cy.location("pathname").should("eq", "/profiles");
    cy.get(`[data-cy="profiles-page"]`).should("be.visible");
  });

  it("klikne na Profil", () => {
    cy.get('nav a[href="/settings/profile"]').click();
    cy.location('pathname', { timeout: 5000 }).should('eq', '/settings/profile');
    cy.get(`[data-cy="settings-profile-page"]`).should("be.visible");
  });

  it("klikne na Registrácia", () => {
    cy.get('nav a[href="/register"]').click();
    cy.location("pathname").should("eq", "/register");
    cy.get(`[data-cy="register-page"]`).should("be.visible");
  });
});


describe("Profiles page (authenticated)", () => {
  beforeEach(() => {
    // raz zalogovať a potešiť sa z кешovania session
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    // teraz už prehliadač *má* cookie, takže SSR pustí stránku
    cy.visit("/profiles");
  });

  it("vyditeľná stránka", () => {
    [
      "profiles-page",
      "profiles-title",
      "profiles-list",
      "user-card-avatar",
      "user-card-name",
      "user-card-email",
      "user-card-phone"
    ].forEach((sel) =>
      cy.get(`[data-cy="${sel}"]`).should("be.visible")
    );
  })

  it("klik na profil", () => {
    cy.get(`[data-cy="user-card"]`).first().click();
    cy.location("pathname").should("match", /^\/profiles\/[0-9a-fA-F-]{36}$/);
  })
});
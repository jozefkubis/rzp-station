describe("Logout button (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/calendar");
    // cy.visit("/");
  });

  // it("Logout Login home page", () => {
  //   cy.get('nav a[href="/login"]').click();
  //   cy.location("pathname").should("eq", "/login");
  //   cy.get(`form[data-cy="login-form"]`).should('be.visible')

  //   cy.get(`input[name="email"]`).type("kubis.jozef@outlook.com")
  //   cy.get(`input[name="password"]`).type("111111")

  //   cy.get(`button[type="submit"]`).click()
  //   cy.get(`button[type="submit"]`).should('be.disabled')
  //   cy.location("pathname").should("eq", "/");
  // });

  it("Logout Login header button", () => {
    // cy.get('nav a[href="/calendar"]', { timeout: 5000 }).click();
    // cy.location("pathname").should("eq", "/calendar");
    cy.get(`button[data-cy="logout-button"]`).click();
    cy.location("pathname").should("eq", "/login");
    cy.get(`form[data-cy="login-form"]`).should('be.visible')

    cy.get(`input[name="email"]`).type("kubis.jozef@outlook.com")
    cy.get(`input[name="password"]`).type("111111")

    cy.get(`button[type="submit"]`).click()
    cy.get(`button[type="submit"]`).should('be.disabled')
    cy.location("pathname").should("eq", "/");
  })
})
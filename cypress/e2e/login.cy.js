describe('login test', () => {
  it("prihlási používateľa s platnými údajmi", () => {
    cy.visit('/login')
    cy.get(`form[data-cy="login-form"]`).should('be.visible')

    cy.get(`input[name="email"]`).type("kubis.jozef@outlook.com")
    cy.get(`input[name="password"]`).type("111111")

    cy.get(`button[type="submit"]`).click()
    cy.get(`button[type="submit"]`).should('be.disabled')
    cy.location("pathname").should("eq", "/");

  })
})
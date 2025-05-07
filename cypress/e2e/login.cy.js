describe('login test', () => {
  it("prihlási používateľa s platnými údajmi", () => {
    cy.visit('/login')
    cy.get(`[data-cy="login-form"]`).should('be.visible')
  })
})
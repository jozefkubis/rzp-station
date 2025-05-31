describe("Profiles page (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/register");
  });

  it("zobrazuje registračný formulár", () => {
    cy.get('[data-cy="register-form"]').should("be.visible");
  });

  // it("umožní registrovať a presmeruje na overenie e-mailu", () => {
  //   cy.get('input[name="email"]').type("kubiss.jozeff@gmail.com");
  //   cy.get('input[name="password"]').type("111111");
  //   cy.get('input[name="re_password"]').type("111111");
  //   cy.get('[data-cy="register-button"]')
  //     .should("be.visible")
  //     .click();

  //   // Po odoslaní formu presmeruje na /verify-email
  //   cy.location("pathname").should("eq", "/verify-email");
  //   cy.get('[data-cy="verify-email-page"]').should("be.visible");
  // });

  // it("umožní overiť e-mail a presmeruje na domovskú stránku", () => {
  //   // Predpokladáme, že sme už na /verify-email
  //   cy.visit("/verify-email");

  //   cy.get('[data-cy="verify-email-button"]')
  //     .should("be.visible")
  //     .click();

  //   // Po overení e-mailu sa vrátime na hlavnú stránku
  //   cy.location("pathname").should("eq", "/");
  // });
});

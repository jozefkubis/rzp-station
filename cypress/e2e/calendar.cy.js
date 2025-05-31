describe("Calendar page (authenticated)", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.loginByUI();
    });
    cy.visit("/calendar");
  });

  it("zobrazuje stránku kalendára a hlási loading", () => {
    cy.get('[data-cy="calendar-page"]').should("be.visible");
    cy.get('[data-cy="calendar-spinner"]').should("be.visible");
    cy.get('[data-cy="calendar-spinner"]').should("not.exist");
    cy.get('[data-cy="calendar-wrapper"]').scrollIntoView();

  });

  it("umožní pridať novú udalosť cez modal", () => {
    // klik na tlačidlo "Pridať udalosť"
    cy.get('[data-cy="calendar-add-event-button"]').click();
    // modal sa zobrazí
    cy.get('[data-cy="calendar-modal"]').should("be.visible");
    // (tu by si mohol doplniť kroky na vyplnenie NewTaskForm a uloženie)
  });

  it("zobrazuje jednotlivé eventy a umožňuje klik na existujúcu udalosť", () => {
    // počkáme, kým sa eventy načítajú
    cy.get('[data-cy="calendar-spinner"]').should("not.exist");
    // predpokladáme, že je aspoň jeden event
    cy.get('[data-cy="calendar-event"]').should("have.length.greaterThan", 0);
    // klik na prvý event
    cy.get('[data-cy="calendar-event"]').first().click();
    // modal sa zobrazí na úpravu
    cy.get('[data-cy="calendar-modal"]').should("be.visible");
    // tu by si mohol kliknúť na tlačidlo v UpdateTaskForm
  });

  it("prepne zobrazenie sviatkov", () => {
    // počkaj, kým sa načítajú eventy (spinner zmizne)
    cy.get('[data-cy="calendar-spinner"]').should("not.exist");
    // klik na toggle sviatkov
    cy.get('[data-cy="calendar-toggle-holidays-button"]').click();
    // over, že sviatky (tie eventy so špeciálnym stylením) majú display: none
    cy.get('[data-cy="calendar-event"]').each(($el) => {
      // ak je to holiday-event, malo by byť skryté
      if ($el.attr("id")?.startsWith("hol-")) {
        cy.wrap($el).should("not.be.visible");
      }
    });

    cy.get('[data-cy="calendar-toggle-holidays-button"]').click();
    cy.get('[data-cy="calendar-event"]').each(($el) => {
      if ($el.attr("id")?.startsWith("hol-")) {
        cy.wrap($el).should("be.visible");
      }
    });
  });


});

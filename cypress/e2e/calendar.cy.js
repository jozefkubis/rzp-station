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
    // cy.get('[data-cy="calendar-spinner"]').should("not.be.visible");
    cy.get('[data-cy="calendar-wrapper"]').scrollIntoView();

  });

  it("umožní pridať novú udalosť cez modal", () => {
    // 0) Vygenerujeme si dnešný dátum vo formáte YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`; // napr. "2025-06-01"

    // 1) Klik na tlačidlo "Pridať udalosť"
    cy.get('[data-cy="calendar-add-event-button"]').click();

    // 2) Počkáme, kým sa modal otvorí a zobrazí formulár
    cy.get('[data-cy="calendar-modal"]').should("be.visible");
    cy.get('[data-cy="new-task-form"]').should("be.visible");

    // 3) Vyplnenie formulára (title, dateFrom, all-day toggle)
    cy.get('input[name="title"]').type("cypress test!");
    cy.get('input[name="dateFrom"]').clear().type(dateStr);

    // Ak máš "all-day" prepínač (toggle) s data-cy="toggle-all-day", klikni:
    cy.get('[data-cy="toggle-all-day"]').click();

    // 4) Odoslanie formulára
    cy.get('[data-cy="new-task-submit"]').click();

    // 5) Počkame, kým sa modal zavrie (alebo zmizne):
    cy.get('[data-cy="calendar-modal"]').should("not.be.true")

    // 6) Overíme, že nová udalosť sa zobrazila v kalendári:
    //    Predpokladáme, že MyEvent v Calendar zobrazuje každý event s data-cy="calendar-event"
    cy.get('[data-cy="calendar-event"]')
      .contains("cypress test!")
      .should("be.visible");
  });


  it("zobrazuje jednotlivé eventy a umožňuje klik na existujúcu udalosť", () => {
    // počkáme, kým sa eventy načítajú
    cy.get('[data-cy="calendar-spinner"]').should("not.exist");
    // predpokladáme, že je aspoň jeden event
    cy.get('[data-cy="calendar-event"]').should("have.length.greaterThan", 0);
    // klik na prvý event
    cy.contains('[data-cy="calendar-event"]', 'cypress test!').click();
    // modal sa zobrazí na úpravu
    cy.get('[data-cy="calendar-modal"]').should("be.visible");
    // tu by si mohol kliknúť na tlačidlo v UpdateTaskForm
    cy.get('[data-cy="update-task-form"]').should("be.visible");
    cy.get('input[name="title"]').clear().type("cypress test 2");
    cy.get('[data-cy="update-task-submit"]').click();
    cy.get('[data-cy="calendar-modal"]').should("not.exist");
    cy.get('[data-cy="calendar-event"]')
      .contains("cypress test 2")
      .should("be.visible");
  });

  it("vymazanie udalosti", () => {
    cy.contains('[data-cy="calendar-event"]', 'cypress test 2').click();
    cy.get('[data-cy="calendar-modal"]').should("be.visible");
    cy.get('[data-cy="delete-task-button"]').click();
    cy.get('[data-cy="calendar-modal"]').should("not.exist");
    cy.contains('[data-cy="calendar-event"]', 'cypress test 2').should("not.exist");
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

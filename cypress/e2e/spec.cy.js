describe("Dummygram Test Suite", () => {
  it("Visit Webpage", () => {
    cy.visit("https://narayan954.github.io/dummygram/");
    cy.url().should("include", "/login");
    cy.get('button[class^="darkmode-toggle"]').click();
  });

  it("Toggle Theme Mode", () => {
    cy.visit("https://narayan954.github.io/dummygram/");
    cy.get('button[class^="darkmode-toggle"]').click();
  });

  it("Logging In", () => {
    cy.visit("https://narayan954.github.io/dummygram/");

    cy.get("input[type=text]").click({ force: true }).should("not.be.visible");
    cy.get("input[type=password]")
      .click({ force: true })
      .should("not.be.visible");
    cy.contains("Sign In").should("be.visible");
  });

  // Add New Test Below

  // it("New Test Part", () => {
  //   cy.visit("https://narayan954.github.io/dummygram/");
  //   // Rest Goes here
  // });
});

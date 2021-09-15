describe("orfs", function () {
  it("the minimum orf size input should work as expected!", function () {
    cy.visit("");
    cy.contains(".tg-menu-bar button", "View").click();
    cy.contains(".bp3-menu-item:contains(7)", "ORFs").click();
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").should(
      "have.value",
      "300"
    );
    //negative numbers shouldn't be allowed and users should be able to select all!
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").type(
      "{selectall}-7000",
      { force: true }
    );
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").should(
      "have.value",
      "7000"
    );
    //the number of orfs displayed should update in real time
    cy.contains(".bp3-menu-item:contains(0)", "ORFs");
  });
});

class IndexModel {
  constructor() {
    this.userInput = "";
    this.validationStatus = "Valid";
    this.polynomialSet = [];
    this.polynomialProduct = undefined;
    this.parser = new PolynomialParser();
    this.divider = new PolynomialDivider();
  }
}
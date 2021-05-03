class IndexModel {
  constructor() {
    this.inputValue = "";
    this.validationStatus = "Valid";
    this.polynomialSet = [];
    this.polynomialProduct = undefined;
    this.parser = new PolynomialParser();
    this.divider = new PolynomialDivider();
  }
}
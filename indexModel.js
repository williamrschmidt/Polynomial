class IndexModel {
  constructor() {
    const tokenizer = new Tokenizer();
    this.inputValue = "";
    this.validationStatus = "Valid";
    this.polynomialSet = [];
    this.polynomialProduct = undefined;
    this.validator = new PolynomialInputValidator(tokenizer);
    this.parser = new PolynomialParser(tokenizer);
    this.divider = new PolynomialDivider();
  }
}
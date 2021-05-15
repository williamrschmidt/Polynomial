/* eslint-disable no-unused-vars, no-undef */

class IndexModel {
  constructor() {
    const tokenizer = new Tokenizer();
    const patterns = new RegexPatterns();
    this.inputValue = "";
    this.validationStatus = "Valid";
    this.polynomialSet = [];
    this.polynomialProduct = undefined;
    this.validator = new PolynomialInputValidator(tokenizer, patterns);
    this.parser = new PolynomialInputParser(tokenizer, patterns);
    this.divider = new PolynomialDivider();
  }
}
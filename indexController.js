/* eslint-disable no-unused-vars, no-undef */

class IndexController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.inputElement.onkeyup = this.processInput.bind(this);
    this.view.productButton.onclick = this.multiplyPolynomialSet.bind(this);
    this.view.factorButton.onclick = this.factorPolynomialProduct.bind(this);
  }

  processInput() {
    this.updateModelInputValue();
    if (this.validateInput()) {
      this.parseInput();
      // User has changed input so clear previously calculated products or factors
      this.view.clearPolynomialProduct();
      this.view.clearPolynomialFactors();
      this.view.clearPolynomialFactorMatrix();
    }
  }

  updateModelInputValue() {
    this.model.inputValue = this.view.inputElement.value;
  }

  validateInput() {
    this.model.validationStatus = this.model.validator.getInputValidationStatus(this.model.inputValue);
    this.view.renderValidationMessage();
    return (this.model.validationStatus.toLowerCase() === "valid");
  }

  parseInput() {
    this.model.polynomialSet = this.model.parser.parseInputToPolynomialSet(this.model.inputValue);
    this.view.renderPolynomialSet();
  }

  multiplyPolynomialSet() {
    this.model.polynomialProduct = this.model.polynomialSet.multiplyAll();
    this.view.renderPolynomialProduct();
  }

  factorPolynomialProduct() {
    this.model.divider.divideAll(this.model.polynomialProduct);
    this.view.renderPolynomialFactors();
    this.view.renderPolynomialFactorMatrix();
  }
}
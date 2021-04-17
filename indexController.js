class IndexController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  processInput() {
    this.setInput();
    if (this.validateInput()) {
      this.parseInput();
    }
  }

  setInput() {
    this.model.userInput = this.view.inputElement.value;
  }

  validateInput() {
    this.model.validationStatus = this.model.parser.getInputValidationStatus(this.model.userInput);
    this.view.renderValidationMessage();
    return (this.model.validationStatus.toLowerCase() === "valid");
  }

  parseInput() {
    this.model.polynomialSet = this.model.parser.parseInputToPolynomialSet(this.model.userInput);
    this.view.renderPolynomialSet();
  }

  multiplyPolynomialSet() {
    this.model.polynomialProduct = this.model.polynomialSet.multiplyAll();
    this.view.renderPolynomialProduct();
  }

  factorPolynomialProduct() {
    this.model.divider.divideAll(this.model.polynomialProduct);
    this.view.renderDivisionMatrix();
  }
}
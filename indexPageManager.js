class IndexPageManager {
  constructor(
    inputElement, validationMessageElement,
    polynomialSetDisplayElement, polynomialProductDisplayElement, polynomialFactorMatrixDisplayElement) {
    this.state = new IndexPageState();
    this.inputElement = inputElement;
    this.validationMessageElement = validationMessageElement;
    this.polynomialSetDisplayElement = polynomialSetDisplayElement;
    this.polynomialProductDisplayElement = polynomialProductDisplayElement;
    this.polynomialFactorMatrixDisplayElement = polynomialFactorMatrixDisplayElement;
    this.parser = new PolynomialParser();
    this.divider = new PolynomialDivider();
    this.renderZeroCoefficientTerms = false;
  }

  setInput() {
    this.state.input = this.inputElement.value;
  }

  validateInput() {
    this.state.validationStatus = this.parser.getInputValidationStatus(this.state.input);
    this.renderValidationMessage();
    return (this.state.validationStatus.toLowerCase() === "valid");
  }

  processInput() {
    this.state.polynomialSet = this.parser.parseInputToPolynomialSet(this.state.input);
    this.renderPolynomialSet();
  }

  multiplyPolynomialSet() {
    this.state.polynomialProduct = this.state.polynomialSet.multiplyAll();
    this.renderPolynomialProduct();
  }

  factorPolynomialProduct() {
    this.divider.divideAll(this.state.polynomialProduct);
    this.renderDivisionMatrix();
  }

  renderValidationMessage() {
    this.validationMessageElement.innerText = this.state.validationStatus;
    if (this.state.validationStatus.toLowerCase() !== "valid") {
      this.inputElement.classList.add("invalid");
      this.validationMessageElement.classList.add("invalid");
    }
    else {
      this.inputElement.classList.remove("invalid");
      this.validationMessageElement.classList.remove("invalid");
    }
  }

  renderPolynomialSet() {
    this.polynomialSetDisplayElement.innerText = this.state.polynomialSet.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderPolynomialProduct() {
    this.polynomialProductDisplayElement.innerText = this.state.polynomialProduct.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderDivisionMatrix() {
    this.polynomialFactorMatrixDisplayElement.textContent = this.divider.renderToLatex();
    MathJax.typeset();
  }
}
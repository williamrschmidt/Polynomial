/* eslint-disable no-unused-vars, no-undef */

// View handles basic HTML updates and MathJax typesetting using model data

class IndexView {
  constructor(document, model, renderZeroCoefficientTerms) {
    this.model = model;
    this.renderZeroCoefficientTerms = renderZeroCoefficientTerms;
    this.inputElement = document.getElementById("input");
    this.inputValidationDisplay = document.getElementById("inputValidationDisplay");
    this.parsedInputDisplay = document.getElementById("parsedInputDisplay");
    this.productButton = document.getElementById("productButton");
    this.productDisplay = document.getElementById("productDisplay");
    this.factorButton = document.getElementById("factorButton");
    this.factorMatrixDisplay = document.getElementById("factorMatrixDisplay");
    this.factorSetDisplay = document.getElementById("factorSetDisplay");
  }

  renderValidationMessage() {
    this.inputValidationDisplay.innerText = this.model.validationStatus;
    if (this.model.validationStatus.toLowerCase() !== "valid") {
      this.inputElement.classList.add("invalid");
      this.inputValidationDisplay.classList.add("invalid");
    }
    else {
      this.inputElement.classList.remove("invalid");
      this.inputValidationDisplay.classList.remove("invalid");
    }
  }

  renderPolynomialSet() {
    this.parsedInputDisplay.textContent = this.model.polynomialSet.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderPolynomialProduct() {
    this.productDisplay.textContent = this.model.polynomialProduct.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  clearPolynomialProduct() {
    this.productDisplay.textContent = "";
  }

  renderPolynomialFactors() {
    this.factorSetDisplay.textContent = this.model.divider.polynomialFactorsToLatex();
    MathJax.typeset();
  }

  clearPolynomialFactors() {
    this.factorSetDisplay.textContent = "";
  }

  renderPolynomialFactorMatrix() {
    this.factorMatrixDisplay.textContent = this.model.divider.matrixToLatex();
    MathJax.typeset();
  }

  clearPolynomialFactorMatrix() {
    this.factorMatrixDisplay.textContent = "";
  }

}
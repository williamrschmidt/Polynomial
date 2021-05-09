class IndexView {
  constructor(document, model) {
    this.model = model;
    this.inputElement = document.getElementById("input");
    this.inputValidationDisplay = document.getElementById("inputValidationDisplay");
    this.parsedInputDisplay = document.getElementById("parsedInputDisplay");
    this.productButton = document.getElementById("productButton");
    this.productDisplay = document.getElementById("productDisplay");
    this.factorButton = document.getElementById("factorButton");
    this.factorMatrixDisplay = document.getElementById("factorMatrixDisplay");
    this.factorSetDisplay = document.getElementById("factorSetDisplay");
    this.renderZeroCoefficientTerms = false;
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
    this.parsedInputDisplay.innerText = this.model.polynomialSet.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderPolynomialProduct() {
    this.productDisplay.innerText = this.model.polynomialProduct.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  clearPolynomialProduct() {
    this.productDisplay.innerText = "";
  }

  renderPolynomialFactorMatrix() {
    this.factorMatrixDisplay.textContent = this.model.divider.matrixToLatex();
    MathJax.typeset();
  }

  renderPolynomialFactors() {
    this.factorSetDisplay.textContent = this.model.divider.polynomialFactorsToLatex();
    MathJax.typeset();
  }

}
class IndexView {
  constructor(document, model) {
    this.model = model;
    this.inputElement = document.getElementById("polynomialInput");
    this.validationMessageElement = document.getElementById("validationMessage");
    this.polynomialSetDisplayElement = document.getElementById("polynomialSetDisplay");
    this.polynomialProductDisplayElement = document.getElementById("polynomialProductDisplay");
    this.polynomialFactorMatrixDisplayElement = document.getElementById("polynomialFactorMatrixDisplay");
    this.renderZeroCoefficientTerms = false;
  }

  renderValidationMessage() {
    this.validationMessageElement.innerText = this.model.validationStatus;
    if (this.model.validationStatus.toLowerCase() !== "valid") {
      this.inputElement.classList.add("invalid");
      this.validationMessageElement.classList.add("invalid");
    }
    else {
      this.inputElement.classList.remove("invalid");
      this.validationMessageElement.classList.remove("invalid");
    }
  }

  renderPolynomialSet() {
    this.polynomialSetDisplayElement.innerText = this.model.polynomialSet.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderPolynomialProduct() {
    this.polynomialProductDisplayElement.innerText = this.model.polynomialProduct.toLatex(this.renderZeroCoefficientTerms);
    MathJax.typeset();
  }

  renderDivisionMatrix() {
    this.polynomialFactorMatrixDisplayElement.textContent = this.model.divider.toLatex();
    MathJax.typeset();
  }
}
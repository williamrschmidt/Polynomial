const pageManager = new IndexPageManager(
  document.getElementById("polynomialInput"),
  document.getElementById("validationMessage"),
  document.getElementById("polynomialSetDisplay"),
  document.getElementById("polynomialProductDisplay"),
  document.getElementById("polynomialFactorMatrixDisplay")
);

function processInput() {
  pageManager.setInput();
  if (pageManager.validateInput()) {
    pageManager.processInput();
  }
}

function multiplyPolynomialSet() {
  pageManager.multiplyPolynomialSet();
}

function factorPolynomialProduct() {
  pageManager.factorPolynomialProduct();
}
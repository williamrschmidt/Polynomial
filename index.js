const model = new IndexModel();
const view = new IndexView(document, model);
const controller = new IndexController(model, view);

function processInput() {
  controller.processInput();
}

function multiplyPolynomialSet() {
  controller.multiplyPolynomialSet();
}

function factorPolynomialProduct() {
  controller.factorPolynomialProduct();
}
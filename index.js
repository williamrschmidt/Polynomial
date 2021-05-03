// Composition root to "wire up" our page. 
// Specific behaviors are implemented in 
// model, view, and controller.

const model = new IndexModel();
const view = new IndexView(document, model);
const controller = new IndexController(model, view);
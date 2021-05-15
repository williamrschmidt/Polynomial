/* eslint-disable no-unused-vars, no-undef */

// Composition root to "wire up" our page. Specific 
// behaviors implemented in model, view, controller.

const renderZeroCoefficientTerms = false;

const model = new IndexModel();
const view = new IndexView(document, model);
const controller = new IndexController(model, view, renderZeroCoefficientTerms);
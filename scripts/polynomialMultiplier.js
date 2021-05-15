/* eslint-disable no-unused-vars, no-undef */

// Chrome won't run module based code from files for security reasons
// import { polynomial } from './polynomial.js'

class PolynomialMultiplier {

  multiply(polynomial1, polynomial2) {
    // We are assuming the two polynomials are in the same variable, e.g. "x".
    // Validation of user input should be designed to ensure this is the case.
    let productTerms = [];
    polynomial1.termSet.terms.forEach(term1 => {
      polynomial2.termSet.terms.forEach(term2 => {
        const productTerm = new PolynomialTerm(
          math.multiply(term1.coefficient, term2.coefficient),
          term1.variable,
          term1.exponent + term2.exponent);
        productTerms.push(productTerm);
      });
    });
    let productTermSet = new PolynomialTermSet(productTerms);
    let productPolynomial = new Polynomial(productTermSet);
    return productPolynomial;
  }

}

// Chrome won't run module based code from files for security reasons
// export { PolynomialMultiplier }
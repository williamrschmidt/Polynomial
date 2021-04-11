// Google Chrome won't run module based code from files for security reasons
// import { polynomial } from './polynomial.js'

class PolynomialMultiplier {
  constructor() {
  }
  multiply(polynomial1, polynomial2) {
    // We are assuming the two polynomials are in the same variable, e.g. "x"
    // validation in the parser should ensure this ideally.
    let productTerms = [];
    polynomial1.termSet.terms.forEach(term1 => {
      polynomial2.termSet.terms.forEach(term2 => {
        productTerms.push(new PolynomialTerm(
          math.multiply(term1.coefficient, term2.coefficient),
          term1.variable,
          term1.exponent + term2.exponent));
      });
    });
    let productTermSet = new PolynomialTermSet(productTerms);
    let productPolynomial = new Polynomial(productTermSet);
    return productPolynomial;
  }
}

// Google Chrome won't run module based code from files for security reasons
// export { divider }
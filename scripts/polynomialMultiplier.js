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
        //console.log("MULTIPLIYING TERMS");
        //console.log(term1);
        //console.log(term2);
        const productTerm = new PolynomialTerm(
          math.multiply(term1.coefficient, term2.coefficient),
          term1.variable,
          term1.exponent + term2.exponent);
        //console.log("PRODUCT TERM");
        //console.log(productTerm);
        productTerms.push(productTerm);
      });
    });
    let productTermSet = new PolynomialTermSet(productTerms);
    let productPolynomial = new Polynomial(productTermSet);
    //console.log("Product Polynomial");
    //console.log(productPolynomial);
    return productPolynomial;
  }
}

// Google Chrome won't run module based code from files for security reasons
// export { divider }
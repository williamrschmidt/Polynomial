// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class PolynomialTermSet {
  constructor(polynomialTerms) {
    this.terms = polynomialTerms;
    this.combineLikeTerms();
    this.injectZeroCoefficientTerms();
  }

  combineLikeTerms(terms) {
    // In order not to experience problematic side effects we iterate our original array
    // and push shallow clones as needed to a new array. However, the basic syntactic
    // patterns for shallow copying objects, such as Object.assign or { ...objectToCopy}
    // don't completely work for custom class instances with methods. The methods, in 
    // particular, don't get copied to the new object. So we use an object copy function
    // derived from that documented at https://www.nickang.com/2018-01-17-how-to-clone-class-instance-javascript/
    let termsConsolidated = [];
    this.terms.forEach(current => {
      if (termsConsolidated.length === 0) {
        termsConsolidated.push(current.clone()); // Important to push a clone of the item, not the same in-memory item
      } else {
        let found = termsConsolidated.find(existing => existing.exponent === current.exponent);
        if (found === null || found === undefined) {
          termsConsolidated.push(current.clone()); // Important to push a clone of the item, not the same in-memory item
        } else {
          found.coefficient = math.add(found.coefficient, current.coefficient);
        }
      }
    });

    // Watch out - this sort order does not seem to work if exponents are fraction objects!
    // User input validation should prevent this as violating the definition of a polynomial.
    let termsConsolidatedSorted = termsConsolidated.sort((a, b) => b.exponent - a.exponent);
    this.terms = termsConsolidatedSorted;
  }

  injectZeroCoefficientTerms(terms) {
    let leadingTerm = this.terms.sort((a, b) => b.exponent - a.exponent)[0];
    if (this.terms.length > 0) {
      const polynomialDegree = leadingTerm.exponent;
      const variable = leadingTerm.variable;
      for (let testExponent = polynomialDegree; testExponent >= 0; testExponent--) {
        if (!this.terms.find(existing => existing.exponent === testExponent)) {
          this.terms.push(new PolynomialTerm(0, variable, testExponent));
        }
      }
    }
    let termsSorted = this.terms.sort((a, b) => b.exponent - a.exponent);
    this.terms = termsSorted;
  }

}
// Google Chrome won't run module based code from files for security reasons
// export { doMatrixStuff }
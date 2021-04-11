// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class Polynomial {

  constructor(polynomialTermSet) {
    this.termSet = polynomialTermSet;// polynomialTerms.sort((x, y) => (y.exponent - x.exponent)); // Terms are assumed to have no gaps, e.g. 2x^2 + 0x + 3, not 2x^2 + 3
    this.coeffs = this.termSet.terms.map(x => x.coefficient); // Use the sorted terms to ensure correct coefficient ordering
    const termsExist = (this.termSet.terms.length > 0);
    this.degree = termsExist ? this.termSet.terms[0].exponent : 0;
    this.leadingCoeff = termsExist ? this.termSet.terms[0].coefficient : 0;
    this.constantTerm = termsExist ? this.termSet.terms[this.termSet.terms.length - 1].coefficient : 0;
  }

  hasQuadraticOrHigherDegree() {
    return this.degree > 1;
  }

  hasActualRationalZero(testRationalZero) {
    let result = false;
    this.actualRationalZeroes.forEach(actualRationalZero => {
      if (math.equal(actualRationalZero, testRationalZero)) {
        result = true;
      }
    })
    return result;
  }

  toLatex(includeZeroCoefficientTerms) {
    const latexOuterDelimiter = "$$";
    const latex = `${latexOuterDelimiter}${this.toInnerLatex(includeZeroCoefficientTerms)}${latexOuterDelimiter}`;
    console.log("Polynomial latex");
    console.log(latex);
    return latex;
  }

  toInnerLatex(includeZeroCoefficientTerms) {
    let latex = "";
    this.termSet.terms.forEach(x => {
      const isLeadingTerm = (x.exponent === this.degree);
      latex = latex + x.toLatex(isLeadingTerm, includeZeroCoefficientTerms);
    })
    return latex;
  }

  get rationalCoefficients() {
    // Converts coefficients to fractional representation
    // Intended for use with integer coefficients mainly
    return this.coeffs.map(x => math.fraction(x));
  }

  get possibleRationalZeroes() {
    let result = [];
    let leadingCoefficientFactors = allFactorsOf(math.number(this.leadingCoeff));
    let constantTermFactors = allFactorsOf(math.number(this.constantTerm));
    constantTermFactors.forEach((ctFactor) => {
      leadingCoefficientFactors.forEach((lcFactor) => {
        result.push(math.fraction(ctFactor, lcFactor));
        result.push(math.fraction(-1 * ctFactor, lcFactor));
      })
    })
    return deduplicate(result);
  }

  get actualRationalZeroes() {
    return this.possibleRationalZeroes.filter((possibleZero) => (math.equal(this.evaluate(possibleZero), math.fraction(0))));
  }

  evaluate(xValue) {
    // ensure numbers are treated as fractions
    let xValueAsFraction = math.fraction(xValue);
    let coeffsAsFractions = this.rationalCoefficients;
    let value = math.Fraction(0);
    for (let coeffIdx = 0, currentPower = this.degree; coeffIdx <= this.degree; coeffIdx++, currentPower--) {
      value = value + coeffsAsFractions[coeffIdx] * xValueAsFraction.pow(currentPower);
    }
    return math.fraction(value);
  }

}
// Google Chrome won't run module based code from files for security reasons
// export { doMatrixStuff }
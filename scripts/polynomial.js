// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class Polynomial {

  constructor(polynomialTermSet) {
    this.termSet = polynomialTermSet;
    // Al the properties below require for correctness that the complete
    // term set has been passed in via the constructor. Were we to allow
    // terms to be later added to the polynomial term set, these would 
    // all have to be converted to properties with getter functions.
    this.coeffs = this.termSet.terms.map(x => x.coefficient); // Use the sorted terms to ensure correct coefficient ordering
    const termsExist = (this.termSet.terms.length > 0);
    const nonConstantTermExists = (this.termSet.terms.length > 1);
    // Leading coefficient and degree are both zero when the polynomial only contains a constant term.
    // https://socratic.org/questions/what-is-the-degree-type-leading-coefficient-and-constant-term-of-h-x-6
    this.degree = nonConstantTermExists ? this.termSet.terms[0].exponent : 0;
    this.leadingCoeff = nonConstantTermExists ? this.termSet.terms[0].coefficient : 0;
    this.constantTerm = termsExist ? this.termSet.terms[this.termSet.terms.length - 1].coefficient : 0;
    // This is also a place where we could throw an exception if the variable letters in terms are inconsistent
    // Alternately that could be (maybe should be? maybe is?) taken care of by the PolynomialTermSet object.
    this.variableLetter = nonConstantTermExists ? this.termSet.terms[0].variable : "x";
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
    //console.log("Polynomial latex");
    //console.log(latex);
    return latex;
  }

  toInnerLatex(includeZeroCoefficientTerms) {
    let latex = "";
    this.termSet.terms.forEach(term => {
      latex = latex + term.toLatex(this.degree, includeZeroCoefficientTerms);
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
        if (lcFactor !== 0) {
          result.push(math.fraction(ctFactor, lcFactor));
          result.push(math.fraction(-1 * ctFactor, lcFactor));
        }
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
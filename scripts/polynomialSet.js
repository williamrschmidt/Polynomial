class PolynomialSet {
  constructor(polynomials) {
    this.polynomials = [];
    if ((polynomials !== null) && (polynomials !== undefined)) {
      this.polynomials = polynomials;
    }
    this.multiplier = new PolynomialMultiplier()
  }

  multiplyAll() {
    if (this.polynomials.length > 0) {
      if (this.polynomials.length === 1) {
        return this.polynomials[0];
      }
      else {
        let result = this.polynomials[0];
        for (let i = 1; i < this.polynomials.length; i++) {
          let current = this.polynomials[i];
          result = this.multiplier.multiply(result, current);
        }
        return result;
      }
    }
  }

  toLatex(includeZeroCoefficientTerms) {
    const latexOuterDelimiter = "$$";
    const result = `${latexOuterDelimiter}${this.toInnerLatex(includeZeroCoefficientTerms)}${latexOuterDelimiter}`;
    return result;
  }

  toInnerLatex(includeZeroCoefficientTerms) {
    let result = "";
    if (this.polynomials.length === 1) {
      result = this.polynomials[0].toInnerLatex(includeZeroCoefficientTerms);
    }
    else {
      this.polynomials.forEach(polynomial => {
        result = result + "(" + polynomial.toInnerLatex(includeZeroCoefficientTerms) + ")";
      });
    }
    return result;
  }
}
class PolynomialSet {

  constructor(polynomials) {
    this.polynomials = polynomials;
  }

  multiplyAll() {
    if (this.polynomials.length > 0) {
      if (this.polynomials.length === 1) {
        return this.polynomials[0];
      }
      else {
        const multiplier = new PolynomialMultiplier();
        let result = this.polynomials[0];
        for (let i = 1; i < this.polynomials.length; i++) {
          let current = this.polynomials[i];
          result = multiplier.multiply(result, current);
        }
        return result;
      }
    }
  }

  toLatex(includeZeroCoefficientTerms) {
    const latexOuterDelimiter = "$$";
    const result = `${latexOuterDelimiter}${this.toInnerLatex(includeZeroCoefficientTerms)}${latexOuterDelimiter}`;
    console.log("Polynomial set latex");
    console.log(result);
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
    //console.log("Polynomial set inner latex");
    //console.log(result);
    return result;
  }
}
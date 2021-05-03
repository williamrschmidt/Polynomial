class PolynomialTerm {

  constructor(coefficient, variable, exponent) {
    this.coefficient = coefficient;
    this.variable = variable;
    this.exponent = exponent;
  }

  clone() {
    const clonedObject = Object.assign(
      Object.create(
        Object.getPrototypeOf(this)
      ),
      this);
    return clonedObject;
  }

  signToLatex(polynomialDegree) {
    const hasNegativeCoefficient = this.coefficient < 0;
    if (math.equal(this.exponent, polynomialDegree)) {
      if (hasNegativeCoefficient) {
        return "-"; // no space after sign for negative leading term
      }
      else {
        return ""; // no sign before positive leading term
      }
    }
    else {
      if (hasNegativeCoefficient) {
        return " - "; // space before and after sign for non-leading term
      }
      else {
        return " + "; // space before and after sign for non-leading term
      }
    }
  }

  unsignedTermToLatex() {
    //console.log("UNSIGNED TERM TO LATEX - ORIGINAL TERM");
    //console.log(this);
    let result;
    const hasZeroExponent = math.equal(this.exponent, 0);
    const hasUnitExponent = math.equal(this.exponent, 1);
    const hasUnitCoefficient = math.equal(math.abs(this.coefficient), 1);
    //console.log("UNSIGNED TERM TO LATEX - COEFFICIENT");
    //console.log(typeof (this.coefficient));
    //console.log(this.coefficient);
    const coefficientAbsoluteValue = math.abs(this.coefficient);
    //console.log("UNSIGNED TERM TO LATEX - COEFFICIENT ABSOLUTE VALUE");
    //console.log(typeof (coefficientAbsoluteValue));
    //console.log(coefficientAbsoluteValue);
    if (hasZeroExponent) {
      result = `${coefficientAbsoluteValue.toLatex()}`;
    }
    else if (hasUnitExponent) {
      if (hasUnitCoefficient) {
        result = `${this.variable}`;
      }
      else {
        result = `${coefficientAbsoluteValue.toLatex()}x`;
      }
    }
    else {
      if (hasUnitCoefficient) {
        result = `${this.variable}^{${this.exponent}}`;
      }
      else {
        result = `${coefficientAbsoluteValue.toLatex()}${this.variable}^{${this.exponent}}`;
      }
    }
    //console.log("HERE IS THE RESULT");
    //console.log(result);
    return result;
  }

  toLatex(polynomialDegree, includeZeroCoefficientTerms) {
    const hasZeroCoefficient = math.equal(this.coefficient, 0);
    if (hasZeroCoefficient && (math.equal(this.exponent, 0) || !includeZeroCoefficientTerms)) {
      return "";
    }
    else {
      return `${this.signToLatex(polynomialDegree)}${this.unsignedTermToLatex()}`;
    }
  }
}
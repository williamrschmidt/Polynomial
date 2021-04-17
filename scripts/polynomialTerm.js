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

  signToLatex(isLeadingTerm) {
    const hasNegativeCoefficient = this.coefficient < 0;
    if (isLeadingTerm) {
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
    const hasZeroExponent = this.exponent === 0;
    const hasUnitExponent = this.exponent === 1;
    const hasUnitCoefficient = math.abs(this.coefficient) === 1;
    const coefficientAbsoluteValue = math.abs(this.coefficient);
    if (hasZeroExponent) {
      return `${coefficientAbsoluteValue}`;
    }
    else if (hasUnitExponent) {
      if (hasUnitCoefficient) {
        return `x`;
      }
      else {
        return `${coefficientAbsoluteValue}x`;
      }
    }
    else {
      if (hasUnitCoefficient) {
        return `x^{${this.exponent}}`;
      }
      else {
        return `${coefficientAbsoluteValue}x^{${this.exponent}}`;
      }
    }
  }

  toLatex(isLeadingTerm, includeZeroCoefficientTerms) {
    const hasZeroCoefficient = this.coefficient === 0;
    if (hasZeroCoefficient && !includeZeroCoefficientTerms) {
      return "";
    }
    else {
      return `${this.signToLatex(isLeadingTerm)}${this.unsignedTermToLatex()}`;
    }
  }
}
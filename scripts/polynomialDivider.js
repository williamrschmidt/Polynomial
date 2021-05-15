/* eslint-disable no-unused-vars, no-undef */

// Chrome won't run module based code from files for security reasons
// import { polynomial } from './polynomial.js'

class PolynomialDivider {
  constructor() {
    // Initialize matrix with a seed array, which will eventually contain 
    // polynomial coefficients and a leading null position for the divisor
    this.matrix = [];

    // The variable letter used for output will be set in the
    // divideAll method based on the polynomial being factored
    this.variableLetterForOutput = null;
  }

  get divisionStepsTaken() {
    // Whether the matrix is newly created or the result of previous division rounds,
    // coefficients for the next division should be in the last matrix "row" array.
    // Determine how many step have been taken in the division. For a matrix with more
    // than zero rows, this should be equal to (number of rows - 1) divided by two.
    if (math.equal(this.matrix.length, 0)) {
      return 0;
    }
    else {
      return math.divide((this.matrix.length - 1), 2);
    }
  }

  getPolynomialFromLastRow() {
    const lastRow = this.matrix[this.matrix.length - 1];
    let terms = [];

    // Iterate the row, excluding the first column (index = 0) containing the divisor,
    // and excluding also any columns after the last meaningful one, which represents
    // the constant term. That column index decreases as the division steps increase.
    const constantTermColumnIndex = lastRow.length - 1 - this.divisionStepsTaken;
    for (let i = 1; i <= constantTermColumnIndex; i++) {
      const coefficient = math.fraction(lastRow[i]);

      // Important - exponents are integers so DO NOT cast to a fraction here.
      // The matrix column index is an integer, which is the right data type.
      const exponent = constantTermColumnIndex - i;
      terms.push(new PolynomialTerm(coefficient, this.variableLetterForOutput, exponent));
    }
    const termSet = new PolynomialTermSet(terms);
    const polynomial = new Polynomial(termSet);
    return polynomial;
  }

  getBinomialFactors() {
    // Iterate over each divisor in the matrix and read out the first-degree binomial 
    // it represents. Divisors are found in in column 0 of the matrix, but of course are found only in some rows.
    // After doing this, we also extract any unfactored  remainder polynomial.
    // The binomials and the remainder are returned as a polynomial set.
    const binomialSet = new PolynomialSet();
    this.matrix.forEach(matrixRow => {
      const divisor = matrixRow[0];
      if ((divisor !== null) && (divisor !== undefined)) {
        const leadingTerm = new PolynomialTerm(math.fraction(1), this.variableLetterForOutput, 1);
        const constantTerm = new PolynomialTerm(math.multiply(math.fraction(-1), divisor), this.variableLetterForOutput, 0);
        const termSet = new PolynomialTermSet([leadingTerm, constantTerm]);
        const binomial = new Polynomial(termSet);
        binomialSet.polynomials.push(binomial);
      }
    });
    return binomialSet;
  }

  getPolynomialFactors() {
    let result = this.getBinomialFactors();

    const remainderPolynomial = this.getPolynomialFromLastRow();
    const remainderPolynomialHasUnitConstantTerm = math.equal(remainderPolynomial.constantTerm, math.fraction(1, 1));

    if (remainderPolynomial.degree === 0) {
      if (!remainderPolynomialHasUnitConstantTerm) {
        result.polynomials.unshift(remainderPolynomial);
      }
    }
    else {
      result.polynomials.push(remainderPolynomial);
    }
    console.log("Polynomial Factors");
    console.log(result.toInnerLatex());
    return result;
  }

  prepareDivisionStep() {
    // The matrix row containing polynomial coefficients already is in place.
    // Extract the polynomial from that existing matrix row, then determine 
    // whether it has rational zeroes. If it does not, return false. If it 
    // does, pick one of them to use as divisor, and set up the division step 
    // by creating addiitonal matrix rows and populating them accordingly.
    const polynomial = this.getPolynomialFromLastRow();
    if (polynomial.actualRationalZeroes.length === 0) {
      return false;
    }
    else {
      // Pick the largest zero, sorting with math.subtract since b and a are fractions.
      // This is just for aesthetics. Any zero would do.
      const divisor = polynomial.actualRationalZeroes.sort((a, b) => math.subtract(b, a))[0];

      // Whether the matrix is newly created or the result of previous division rounds,
      // coefficients for the next division should be in the last matrix "row" array.
      // Set the divisor as the first element in that row, and create two new empty rows.
      let lastRow = this.matrix[this.matrix.length - 1];
      lastRow[0] = math.fraction(divisor);
      this.matrix.push(lastRow.map((x) => null));
      this.matrix.push(lastRow.map((x) => null));

      // We are done preparing. Execution is handled elsewhere.
      return true;
    }
  }

  executeDivisionStep() {
    // Execute one round of synthetic division, carrying out numeric 
    // manipulations more or less exactly as one would do on paper
    let coeffs = this.matrix[this.matrix.length - 3];  // array two up from bottom array
    let divisor = coeffs[0];
    let addenda = this.matrix[this.matrix.length - 2]; // array one up from bottom array
    let sums = this.matrix[this.matrix.length - 1];    // bottom array

    // Column 0 contains the divisor, so start with column 1, containing the polynomial's leading 
    // coefficient. Initiate division by dropping that coefficient directly down to the sums line.
    sums[1] = coeffs[1];

    // Iterate over all the other columns to the right of the one containing the leading coefficient and carry out
    // the repeating operation of synthetic division, which is to multiply our divisor (item 0 in the coeffs array)
    // by the previous sum, add it to the current coefficient to obtain a new sum, which is placed in the sums array.
    for (let i = 2; i < coeffs.length; i++) {

      let lastColSum = sums[i - 1];
      let nextColCoefficient = coeffs[i];
      let nextColValueToAdd = math.multiply(lastColSum, divisor);  // must use math.multiply for proper fraction handling
      let nextColSum = math.add(nextColCoefficient, nextColValueToAdd); // must use math.add for propert fraction handling

      addenda[i] = nextColValueToAdd;
      sums[i] = nextColSum;
    }
    let polynomialResult = this.getPolynomialFromLastRow();

    // This console output is pretty useful, not too overwhelming
    console.log(`Division Step ${this.divisionStepsTaken} Polynomial Result`)
    console.log(polynomialResult.toInnerLatex());
    console.log(polynomialResult);

    return polynomialResult;
    // This round of synthetic division is done and the matrix is ready for another potential round of division.
  }

  divideAll(polynomial) {
    // Execute as many individual synthetic division steps as required to fully factor the polynomial into
    // degree-one binomials, plus a potential remainder polynomial (which may be simply a constant term).
    // We are only using divisors already proven to be zeroes so each division step should result in a clean 
    // remainder polynomial of degree one less than the degree of the original polynomial divided in that step.
    // Note that some steps may be repeated more than once, if the divisor for one step can be again used as a 
    // divisor for the remainder polynomial. When all steps are taken, the matrix is fully populated.
    console.log("Polynomial to be divided");
    console.log(polynomial.toInnerLatex());
    console.log(polynomial);

    // Set the PolynomialDivider object's variableLetterForOutput property. This character is cached so that
    // the divider can later read out the coefficients from the matrix and typset those polynomials on screen.
    this.variableLetterForOutput = polynomial.variableLetter;

    this.matrix = []; // must reinitialize matrix as polynomial may be different from last division.

    // The seed array is simply the first row of the matrix, containing the original 
    // polynomial coefficients, and an empty initial column (index = 0) for divisors
    let seedArray = [null, ...polynomial.rationalCoefficients];
    this.matrix.push(seedArray);

    let canStart = (polynomial.actualRationalZeroes.length > 0);
    let canDivide = false;

    if (canStart) {
      do {
        canDivide = this.prepareDivisionStep();
        if (canDivide) {
          this.executeDivisionStep();
        }
      }
      while (canDivide);
    }
  }

  matrixRowToLatex(arr) {
    return arr.map(x => (x === null ? `` : x.toLatex())).join('&');
  }

  renderTestRowToMatrix(arr) {
    let matrixStartTag = '\\begin{vmatrix}';
    let matrixEndTag = '\\end{vmatrix}';
    let testRowLatex = this.matrixRowToLatex(arr);
    return `${matrixStartTag} ${testRowLatex} ${matrixEndTag}`;
  }

  latexColumnFormatString() {
    // For our right-aligned column display, we need a column format
    // string that looks something like this: '{r | r r r r}'. But the 
    // number of columns we need varies according to the degree of our
    // polynomial, so it can't be hard-coded. The example above is what
    // we need to accommodate a 3rd degree polynomial (plus the extra
    // left-hand column for the divisor). A 2nd degree polynomial would
    // only require the tag '{r | r r r}', and in general the number of
    // 'r' characters after the pipe equals the polynomial degree.
    const matrixWidth = this.matrix[0].length;
    const charsAfterPipe = Array(matrixWidth - 1).fill('r'); // r = right-justify numbers
    return ['r', '|', ...charsAfterPipe];
  }

  matrixToLatex() {
    // Produces text that can be rendered as good-looking mathematical output.
    // We render this in the browser by linking to a JS library from MathJax.
    // https://www.latex-project.org//
    let matrixStartTag = `\\begin{array}{${this.latexColumnFormatString()}}`;
    let matrixEndTag = `\\end{array}`;
    let output = matrixStartTag;
    for (let i = 0; i < this.matrix.length; i++) {
      let isSumsRow = (i > 0 && i % 2 === 0);
      if (output === matrixStartTag) {
        output = `${output} ${this.matrixRowToLatex(this.matrix[i])}`;
      }
      else {
        if (isSumsRow) {
          output = `${output} \\\\ \\hline ${this.matrixRowToLatex(this.matrix[i])}`;
        } else {
          output = `${output} \\\\ ${this.matrixRowToLatex(this.matrix[i])}`;
        }
      }
    }
    output = `${output} ${matrixEndTag}`;
    return output;
  }

  polynomialFactorsToLatex() {
    const polynomialFactorSet = this.getPolynomialFactors();
    return polynomialFactorSet.toLatex();
  }
}

// Chrome won't run module based code from files for security reasons
// export { PolynomialDivider }
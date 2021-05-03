// Google Chrome won't run module based code from files for security reasons
// import { polynomial } from './polynomial.js'

class PolynomialDivider {
  constructor() {
    //this.polynomial = polynomial;
    // Initialize matrix with a seed array containing polynomial 
    // coefficients, and a leading null position for the divisor
    this.matrix = [];
    // The variable letter used for output will be set in the
    // divideAll method based on the polynomial being factored
    this.variableLetterForOutput = null;
  }

  getPolynomialFromLastRow() {
    // Whether the matrix is newly created or the result of previous division rounds,
    // coefficients for the next division should be in the last matrix "row" array.
    // Determine how many step have been taken in the division. This should be equal
    // to (number of rows - 1) divided by two.
    const divisionStepsTaken = math.divide((this.matrix.length - 1), 2);
    //console.log(`Division Steps Taken: ${divisionStepsTaken}`);
    const lastRow = this.matrix[this.matrix.length - 1];
    const constantTermColumnIndex = lastRow.length - 1 - divisionStepsTaken;
    //console.log("Last row");
    //console.log(lastRow);
    let terms = [];
    // Iterate the row, excluding the first column (index = 0) which contains the
    // zero, and excluding also any columns after the last meaningful one, representing
    // the constant term. That column index decreases as the division steps increase.
    for (let i = 1; i <= constantTermColumnIndex; i++) {
      const coefficient = math.fraction(lastRow[i]);
      //console.log("Coefficient");
      //console.log(coefficient);
      const exponent = math.fraction(constantTermColumnIndex - i);
      terms.push(new PolynomialTerm(coefficient, this.variableLetterForOutput, exponent));
    }
    const termSet = new PolynomialTermSet(terms);
    const polynomial = new Polynomial(termSet);
    //console.log("Polynomial From Last Row");
    //console.log(polynomial);
    return polynomial;
  }

  getMonomialFactors() {
    const monomialSet = new PolynomialSet();
    //console.log("In getMonomialsFromFirstColumn: division matrix");
    //console.log(this.matrix);
    // Monomial factors are represented only by the divisors found on even-number-indexed rows
    // Those should also be rows in which the zero position (divisor) is non-null.
    this.matrix.forEach(matrixRow => {
      //console.log("Current Matrix row");
      //console.log(matrixRow);
      const divisor = matrixRow[0];
      //console.log("Curent Divisor");
      //console.log(divisor);
      if ((divisor !== null) && (divisor !== undefined)) {
        //console.log(`Processing divisor ${divisor}`);
        const leadingTerm = new PolynomialTerm(math.fraction(1), this.variableLetterForOutput, 1);
        const constantTerm = new PolynomialTerm(math.multiply(math.fraction(-1), divisor), this.variableLetterForOutput, 0);
        const termSet = new PolynomialTermSet([leadingTerm, constantTerm]);
        const monomial = new Polynomial(termSet);
        monomialSet.polynomials.push(monomial);
      }
    });
    //console.log("Monomial Set");
    //console.log(monomialSet);
    return monomialSet;
  }

  getPolynomialFactors() {
    let result = this.getMonomialFactors();
    let remainderPolynomial = this.getPolynomialFromLastRow();
    //console.log("getPolynomialFactors: Remainder Polynomial");
    //console.log(remainderPolynomial);
    const remainderPolynomialHasDegreeZero = (math.equal(remainderPolynomial.degree, 0));
    //console.log(`remainderPolynomialHasDegreeZero: ${remainderPolynomialHasDegreeZero}`);
    const remainderPolynomialHasUnitConstantTerm = math.equal(remainderPolynomial.constantTerm, math.fraction(1, 1));
    //console.log(`remainderPolynomialHasUnitConstantTerm: ${remainderPolynomialHasUnitConstantTerm}`);

    if (remainderPolynomial.degree === 0) {
      if (!remainderPolynomialHasUnitConstantTerm) {
        result.polynomials.unshift(remainderPolynomial);
      }
    }
    else {
      result.polynomials.push(remainderPolynomial);
    }
    console.log("Polynomial Factors");
    console.log(result);
    return result;
  }

  prepareDivisionStep(divisor) {
    // Whether the matrix is newly created or the result of previous division rounds,
    // coefficients for the next division should be in the last matrix "row" array.
    let lastRow = this.matrix[this.matrix.length - 1];
    lastRow[0] = math.fraction(divisor);
    this.matrix.push(lastRow.map((x) => null));
    this.matrix.push(lastRow.map((x) => null));
  }

  executeDivisionStep() {
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
    console.log(`Division Step ${this.divisionStepsTaken} Polynomial Result`)
    console.log(polynomialResult.toLatex());
    return polynomialResult;
    // This round of synthetic division is done and the matrix is ready for another potential round of division.
  }

  divideAll(polynomial) {
    // Execute the divide method for each actual rational zero in the polynomial.
    // This should leave the matrix fully populated and ready to be presented.
    console.log("Polynomial to be divided");
    console.log(polynomial);
    this.variableLetterForOutput = polynomial.variableLetter;
    //console.log("Polynomial Divider Assigned Variable Letter");
    //console.log(this.variableLetterForOutput);
    this.matrix = []; // must reinitialize matrix as polynomial may be different from last division.
    let seedArray = [null, ...polynomial.rationalCoefficients];
    this.matrix.push(seedArray);

    let divisionStepNumber = 0; // used for logging to console only
    polynomial.actualRationalZeroes.forEach((actualRationalZero) => {

      divisionStepNumber++;
      let divisionStepNumberCurrentRoot = 1; // also used only for logging to console when one we have a repeating root

      this.prepareDivisionStep(actualRationalZero);
      let polynomialResult = this.executeDivisionStep();

      //console.log("First division result");
      //console.log(polynomialResult);
      //console.log("First division divisor");
      //console.log(actualRationalZero);
      //console.log("First division result actual rational zeroes");
      //console.log(polynomialResult.actualRationalZeroes);

      let canStillDivide = polynomialResult.hasActualRationalZero(actualRationalZero) && (polynomialResult.hasQuadraticOrHigherDegree());
      if (canStillDivide) {
        //console.log("Divisor can divide again");
        // We aren't done if this rational zero divides the polynomial multiple times.
        // If this is truewe can take care of that with a do...while loop until the 
        // rational zero is "tapped out" for division. Then we move to the next one.
        do {
          divisionStepNumber++;
          divisionStepNumberCurrentRoot++;
          //console.log(`Root ${actualRationalZero} division iteration ${divisionStepNumberCurrentRoot}`)
          this.prepareDivisionStep(actualRationalZero);

          polynomialResult = this.executeDivisionStep();

          //console.log("Additional division result");
          //console.log(polynomialResult);

          canStillDivide = polynomialResult.hasActualRationalZero(actualRationalZero) && (polynomialResult.hasQuadraticOrHigherDegree());
        }
        while (canStillDivide);
      }
    });
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
    //let charsAfterPipe = Array(this.polynomial.degree).fill('r'); // r = right-justify numbers
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
    //console.log("Matrix LaTex");
    //console.log(output);
    return output;
  }

  polynomialFactorsToLatex() {
    const polynomialFactorSet = this.getPolynomialFactors();
    return polynomialFactorSet.toLatex();
  }
}

// Google Chrome won't run module based code from files for security reasons
// export { divider }
// Google Chrome won't run module based code from files for security reasons
// import { polynomial } from './polynomial.js'

class PolynomialDivider {
  constructor() {
    //this.polynomial = polynomial;
    // Initialize matrix with a seed array containing polynomial 
    // coefficients, and a leading null position for the divisor
    this.matrix = [];
  }

  getPolynomialFromLastRow(variableLetter, divisionStepNumber) {
    // Whether the matrix is newly created or the result of previous division rounds,
    // coefficients for the next division should be in the last matrix "row" array.
    const lastRow = this.matrix[this.matrix.length - 1];
    console.log("Last row");
    console.log(lastRow);
    let terms = [];
    for (let i = 1; i < lastRow.length - divisionStepNumber; i++) {
      const coefficient = lastRow[i];
      console.log("Coefficient");
      console.log(coefficient);
      const variable = variableLetter;
      const exponent = lastRow.length - 1 - divisionStepNumber - i;
      terms.push(new PolynomialTerm(coefficient, variable, exponent));
    }
    const termSet = new PolynomialTermSet(terms);
    const polynomial = new Polynomial(termSet);
    return polynomial;
  }

  prepareDivisionStep(divisor) {
    // Whether the matrix is newly created or the result of previous division rounds,
    // coefficients for the next division should be in the last matrix "row" array.
    let lastRow = this.matrix[this.matrix.length - 1];
    lastRow[0] = math.fraction(divisor);
    this.matrix.push(lastRow.map((x) => null));
    this.matrix.push(lastRow.map((x) => null));
  }

  executeDivisionStep(variableLetter, divisionStepNumber) {
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
    let polynomialResult = this.getPolynomialFromLastRow(variableLetter, divisionStepNumber);
    return polynomialResult;
    // This round of synthetic division is done and the matrix is ready for another potential round of division.
  }

  divideAll(polynomial) {
    // Execute the divide method for each actual rational zero in the polynomial.
    // This should leave the matrix fully populated and ready to be presented.
    const variableLetter = polynomial.termSet.terms[0].variableLetter;
    this.matrix = []; // must reinitialize matrix as polynomial may be different from last division.
    let seedArray = [null, ...polynomial.rationalCoefficients];
    this.matrix.push(seedArray);

    let divisionStepNumber = 0;
    polynomial.actualRationalZeroes.forEach((actualRationalZero) => {
      divisionStepNumber++;
      let divisionStepNumberCurrentRoot = 1;
      this.prepareDivisionStep(actualRationalZero);
      let polynomialResult = this.executeDivisionStep(variableLetter, divisionStepNumber);
      console.log("First division result");
      console.log(polynomialResult);
      console.log("First division divisor");
      console.log(actualRationalZero);
      console.log("First division result actual rational zeroes");
      console.log(polynomialResult.actualRationalZeroes);
      let canStillDivide = polynomialResult.hasActualRationalZero(actualRationalZero) && (polynomialResult.hasQuadraticOrHigherDegree());
      if (canStillDivide) {
        console.log("Divisor can divide again");
        // We aren't done if this rational zero divides the polynomial multiple times.
        // If this is truewe can take care of that with a do...while loop until the 
        // rational zero is "tapped out" for division. Then we move to the next one.
        do {
          divisionStepNumber++;
          divisionStepNumberCurrentRoot++;
          console.log(`Root ${actualRationalZero} division iteration ${divisionStepNumberCurrentRoot}`)
          this.prepareDivisionStep(actualRationalZero);
          polynomialResult = this.executeDivisionStep(variableLetter, divisionStepNumber);
          console.log("Additional division result");
          console.log(polynomialResult);
          canStillDivide = polynomialResult.hasActualRationalZero(actualRationalZero) && (polynomialResult.hasQuadraticOrHigherDegree());
        }
        while (canStillDivide);
      }
    });
  }

  renderRowToLatex(arr) {
    return arr.map(x => (x === null ? `` : x.toLatex())).join('&');
  }

  renderTestRowToMatrix(arr) {
    let matrixStartTag = '\\begin{vmatrix}';
    let matrixEndTag = '\\end{vmatrix}';
    let testRowLatex = this.renderRowToLatex(arr);
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

  renderToLatex() {
    // Produces text that can be rendered as good-looking mathematical output.
    // We render this in the browser by linking to a JS library from MathJax.
    // https://www.latex-project.org//
    let matrixStartTag = `\\begin{array}{${this.latexColumnFormatString()}}`;
    let matrixEndTag = `\\end{array}`;
    let output = matrixStartTag;
    for (let i = 0; i < this.matrix.length; i++) {
      let isSumsRow = (i > 0 && i % 2 === 0);
      if (output === matrixStartTag) {
        output = `${output} ${this.renderRowToLatex(this.matrix[i])}`;
      }
      else {
        if (isSumsRow) {
          output = `${output} \\\\ \\hline ${this.renderRowToLatex(this.matrix[i])}`;
        } else {
          output = `${output} \\\\ ${this.renderRowToLatex(this.matrix[i])}`;
        }
      }
    }
    output = `${output} ${matrixEndTag}`;
    return output;
  }
}

// Google Chrome won't run module based code from files for security reasons
// export { divider }
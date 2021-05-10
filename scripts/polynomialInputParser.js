// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class PolynomialInputParser {
  constructor(tokenizer) {
    // Tokenizer is used to parse strings to token arrays
    this.tokenizer = tokenizer;

    // The regex below captures all individual polynomial terms from one polynomial string
    // Given "2x^5 - 4/5x^3 + 4x - 4", captures "2x^5", " - 4/5x^3", " + 4x", and " - 4"
    // Each capture gets the entire term along with three sub-segments defined via capture groups ()
    //     (\s*[\+-]?\s*\d*[/]?\d*)    captures the coefficient       e.g. "2", " - 4/5", " + 4", " - 4"
    //     (\s*x)?                     captures the variable letter   e.g. "x", "x", "", "x"
    //     (?:\s*\^\s*([\+-]?\s*\d+))? identifies an exponent segment e.g. "^5", "^3", "", ""
    //                ([\+-]?\s*\d+)   captures the numeric exponent  e.g. "5", "3", "", ""
    this.polynomialTermRegex = /(\s*[\+-]?\s*\d*[/]?\d*)(\s*[a-zA-Z])?(?:\s*\^\s*([\+-]?\s*\d+))?/gi;

    // The regex below captures all the whole polynomials between parentheses in a string
    // Given "(2x^3 - 5)(4x + 4)", captures "2x^3 - 5" and "4x + 4"
    this.polynomialBetweenParenthesesRegex = /\(([^)]+)\)/g;
    //this.polynomialBetweenParenthesesRegex = /\(([^\)])\)/g; Corrupted the regex! Stopped working! Doesn't pick up multi-chars in parens.
    //this.polynomialBetweenParenthesesRegex = /\((.*)\)/g; picks up single polys in parens but mashes multi polys together into one bogus one

    // The regex below determines whether either a left or right parenthesis exists in a string.
    this.hasParenthesesRegex = /[\(\)]/g;

    // REPEATED IN PolynomialInputValidator; 
    // Should regexes be put in their own little class to avoid duplication?
    // Should these all be added to the Tokenizer class and referenced there?
    // The regex below captures all individual letters from a string
    // Given "2xy + 3z - 4w", captures "x", "y" and "w"
    this.individualLetterCaptureRegex = /([a-zA-Z]{1})/g;
  }

  parseInputToPolynomialSet(input) {
    let polynomialStrings = this.parseInputToPolynomialStrings(input);
    let polynomialTermSets = polynomialStrings.map(polynomialString => this.parsePolynomialStringToTermSet(polynomialString));
    let polynomials = [];
    polynomialTermSets.forEach(termSet => {
      polynomials.push(new Polynomial(termSet));
    });
    const polynomialSet = new PolynomialSet(polynomials);
    return polynomialSet;
  }

  getDefaultVariableLetter(input) {
    let result = "x";
    console.log("getDefaultVariableLetter: Entering");
    console.log(`getDefaultVariableLetter: Input: ${input}`);
    // Capture tokens representing individual letter characters.
    // Each captured token is itself an array. For string "x + y", 
    // the first captured token is ["x", "x", index: 0, input: "x + y", groups: undefined].
    // The second captured token is ["y", "y", index: 4, input: "x + y", groups: undefined]
    const singleLetterTokens = this.tokenizer.tokenize(input, this.individualLetterCaptureRegex);
    console.log("getDefaultVariableLetter: Single letter tokens");
    console.log(singleLetterTokens);
    // Since input validation should have already taken care of preventing there being
    // more than one different letter, check to see if any single letter tokens were
    // found at all. If any were found, simply use the first one as the default variable 
    // letter. If none were found, set the default variable letter to "x". 
    if (singleLetterTokens.length > 0) {
      result = singleLetterTokens[0][0];
    }
    console.log(`getDefaultVariableLetter: Result: ${result}`);
    console.log("getDefaultVariableLetter: Exiting");
    return result;
  }

  parsePolynomialStringToTermSet(input) {
    console.log("parsePolynomialStringToTermSet: Entering");
    // TODO Currently setting "x" as hard default. Improving this would mean scanning the whole polynomial 
    // string for letters first. We should do that here, where we do have the entire input available.
    // User input validation should already ensure we only have one variable letter at most in the polynomial.
    // "x" should only be used if the polynomial contains no variable letters at all (only a constant term).
    const variableLetterDefault = this.getDefaultVariableLetter(input);
    let tokens = this.tokenizer.tokenize(input, this.polynomialTermRegex);
    console.log("parsePolynomialStringToTermSet: Tokens");
    console.log(tokens);
    let termSet = this.tokensToTermSet(tokens, variableLetterDefault);
    console.log("parsePolynomialStringToTermSet: Exiting");
    return termSet;
  }

  parseInputToPolynomialStrings(input) {
    let result = [];

    if (!input.match(this.hasParenthesesRegex)) {
      // No parentheses found, so assume the entire input string is 
      // one polynomial and return it in a single-element array
      result.push(input);
    }
    else {
      let wholePolynomialTokens = this.tokenizer.tokenize(input, this.polynomialBetweenParenthesesRegex);
      wholePolynomialTokens.forEach(token => {
        if ((token[0] !== "") && (token[0] !== undefined)) {
          result.push(token[0]);
        }
      })
    }
    return result;
  }

  tokensToTermSet(tokens, variableLetterDefault) {
    // Here we project the raw polynomial term tokens, extracted from a single
    // polynomial string, into an array of well-formed polynomialTerm objects.
    // A single token for a polynomial term, as extracted during parsing, is an array of items:
    //    token[0]: Text of the entire raw captured polynomial term, e.g. " + 2x^4"
    //    token[1]: Text of the coefficient portion,        e.g. " + 2" (can be empty, +/- sign, numeral/fraction, or +/- sign with numeral/fraction)
    //    token[2]: Text of the variable letter portion,    e.g. "x"    (can be a letter or empty string)
    //    token[3]: Text of the numerical exponent portion, e.g. "4"    (can be empty or a numeral)
    const terms = tokens.map(token => new PolynomialTerm(
      this.extractTokenCoefficient(token),
      this.extractTokenVariableLetter(token, variableLetterDefault),
      this.extractTokenExponent(token)
    ));
    const polynomialTermSet = new PolynomialTermSet(terms);
    return polynomialTermSet;
  }

  extractTokenCoefficient(token) {
    // The token for a polynomial term is an array of captured parts.
    // Extract or infer the correctly typed coefficient.

    // We have to handle different cases, based on whether or not there is a variable letter, etc.
    const capturedCoefficient = token[1];
    const capturedCoefficientIsEmpty = (capturedCoefficient.trim() === "");
    const capturedCoefficientIsSignOnly = (capturedCoefficient.trim() === "+" || capturedCoefficient.trim() === "-");
    const capturedVariableLetter = token[2];

    if ((capturedCoefficientIsEmpty || capturedCoefficientIsSignOnly) && capturedVariableLetter === undefined) {
      // This case handles a bare sign with no variable letter. When would this occur?
      // Perhaps only when user is entering a new term and has only typed + or -.
      // Consider the coefficient to be zero in this case.
      return math.fraction(0);
    }
    else if (capturedCoefficientIsEmpty || capturedCoefficientIsSignOnly) {
      // This case handles a bare variable with implied coefficient = 1, e.g. +x or - x or x^5
      // Parsing is done on what basically amounts to the sign, with the number 1 stuffed in after
      return math.fraction(`${capturedCoefficient.replace(/\s/g, "")}1`); // regex eliminates white space
    }
    else {
      // This is the normal case where there is a sign, a number/fraction, 
      // and a variable letter. Parse the whole thing as a fraction object.
      return math.fraction(capturedCoefficient.replace(/\s/g, "")); // regex eliminates white space
    }
  }

  extractTokenVariableLetter(token, variableLetterDefault) {
    // The token for a polynomial term is an array of captured parts.
    // Extract or infer the variable letter.
    const capturedVariableLetter = token[2];
    if (capturedVariableLetter === undefined) {
      return variableLetterDefault;
    }
    else {
      return capturedVariableLetter.toLowerCase()
    }
  }

  extractTokenExponent(token) {
    // The token for a polynomial term is an array of captured parts.
    // Extract or infer the correctly typed exponent.
    const capturedExponent = token[3];
    const capturedVariableLetter = token[2];

    if (capturedExponent === undefined) {
      if (capturedVariableLetter === undefined) {
        return 0;
      }
      else {
        return 1;
      }
    }
    else {
      // Fish the number out, casting as an integer.
      // Polynomial exponents should never be fractions.
      return parseInt(token[3].replace(/\s/g, ""));
    }
  }

}

// Google Chrome won't run module based code from files for security reasons
// export { PolynomialParser }
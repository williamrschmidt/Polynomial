// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class PolynomialParser {

  constructor() {
    this.singlePolynomialRegex = /(\s*[\+-]?\s*\d*)(\s*x)?(?:\s*\^\s*([\+-]?\s*\d+))?/gi;
    //this.regexWithoutCaptureGroups = /([\+-]?\d*)(?:x(?:\^[\+-]?\d+)?)?/gi
    this.multiPolynomialRegex = /\(([^)]+)\)/g;
    //this.multiPolynomialRegex = /\(([^\)])\)/g; Corrupted the regex! Stopped working! Doesn't pick up multi-chars in parens.
    //this.multiPolynomialRegex = /\((.*)\)/g; picks up single polys in parens but mashes multi polys together into one bogus one
    this.multiLetterSequenceRegex = /[A-Za-z]{2}/;
    this.letterFollowedByNumeralRegex = /[a-zA-Z][0-9]/;
    this.individualLetterCaptureRegex = /([a-zA-Z]{1})/g;
  }

  getInputValidationStatus(input) {
    let result = "Valid";

    // check for multiple different letters anywhere in the whole input string, e.g. 2x^2 + 3y
    const singleLetterTokens = this.tokenize(input, this.individualLetterCaptureRegex);
    //console.log("Individual Letter Capture Regex Tokens");
    //console.log(singleLetterTokens);
    let multipleLettersFound = false;
    let lastExaminedLetter = null;
    // tokens contain captured individual letter characters.
    // Analyze to see if these are all the same or different.
    // Each captured token is itself an array. For string "x + y", 
    // the first captured token is ["x", "x", index: 0, input: "x + y", groups: undefined].
    // The second caputured token is ["y", "y", index: 4, input: "x + y", groups: undefined]
    singleLetterTokens.forEach(singleLetterToken => {
      const currentLetter = singleLetterToken[0];
      if ((lastExaminedLetter !== null) && (lastExaminedLetter.toLowerCase() !== currentLetter.toLowerCase())) {
        multipleLettersFound = true;
      }
      lastExaminedLetter = currentLetter;
    });
    if (multipleLettersFound) {
      result = "Invalid: Cannot use two different variable letters";
      return result;
    }

    // check for multiple letters in a row, e.g. xx. This will also on its own find patterns
    // like xy, but that will have been caught already by the multi-letter test above.
    if (input.match(this.multiLetterSequenceRegex)) {
      result = "Invalid: Cannot have two letters in sequence";
      return result;
    }

    // check for letters followed immediately by numerals, e.g. x4 rather than the correct x^4.
    if (input.match(this.letterFollowedByNumeralRegex)) {
      result = "Invalid: Exponents must be separated from variables by the ^ character";
      return result;
    }

    return result;
  }

  parseInputToPolynomialSet(input) {
    ////console.log("Parse input");
    ////console.log(input);
    let polynomialStrings = this.parseInputToPolynomialStrings(input);
    ////console.log("parsed whole polynomials");
    ////console.log(polynomialStrings);
    let polynomialTermSets = polynomialStrings.map(polynomialString => this.parsePolynomialStringToTermSet(polynomialString));
    //console.log("parsed polynomial term sets");
    //console.log(polynomialTermSets);
    let polynomials = [];
    polynomialTermSets.forEach(termSet => {
      polynomials.push(new Polynomial(termSet));
    });
    const polynomialSet = new PolynomialSet(polynomials);
    //console.log("Polynomial set from input");
    //console.log(polynomialSet);
    return polynomialSet;
  }

  parsePolynomialStringToTermSet(input) {
    ////console.log("Tokens with capture groups");
    let tokens = this.tokenize(input, this.singlePolynomialRegex);
    ////console.log(tokens);

    ////console.log("Term set cleaned up as objects");
    let termSet = this.tokensToTermSet(tokens);
    ////console.log(tokenObjects);

    return termSet;
  }

  parseInputToPolynomialStrings(input) {

    //console.log("Parse input to polynomial strings input:");
    //console.log(input);

    let result = [];
    if (!input.match(/[\(\)]/g)) { //this.multiPolynomialRegex)) {
      // If no parentheses found, assume only one polynomial
      // Return the entire input string as a single-element array
      //console.log("No parentheses found");
      result.push(input);
    }
    else {
      // Even if no right parenthesis exists we still use this branch
      // We won't find anything if the user has typed only partial input
      //console.log("Parenthesis found");
      if (input.match(this.multiPolynomialRegex)) {
        //console.log("Double parentheses found")
      }
      let wholePolynomialTokens = this.tokenize(input, this.multiPolynomialRegex); // produces an array of matches
      wholePolynomialTokens.forEach(token => {
        if ((token[0] !== "") && (token[0] !== undefined)) {
          result.push(token[0]);
        }
      })
    }
    //console.log("Parse whole polynomials result");
    //console.log(result);
    return result;
  }

  tokenize(str, regex) {
    // With some modiication by me to add the result array, this
    // code was helpfully generated by an online tool at

    // https://regex101.com/
    // Another useful tool that will diagram your regex is at
    // https://regexper.com/

    // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

    ////console.log("Tokenize function input:");
    ////console.log(str);

    let tokens = [];
    let token;

    while ((token = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (token.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // check to see if the captured token string is empty before pushing
      if (token[0] !== "") tokens.push(token);
    }
    ////console.log("Tokenize function result:");
    ////console.log(tokens);
    return tokens;
  }

  tokensToTermSet(tokens) {
    const terms = tokens.map(x => new PolynomialTerm(
      // set the coefficient. This has a lot of different cases but basically we are digging out a number, cast as a fraction type
      ((x[1].trim() === "" || x[1].trim() === "+" || x[1].trim() === "-") && x[2] === undefined ? math.fraction(0) :
        (x[1].trim() === "" || x[1].trim() === "+" || x[1].trim() === "-") ? math.fraction(parseInt(`${x[1].replace(/\s/g, "")}1`)) :
          math.fraction(parseInt(x[1].replace(/\s/g, "")))),
      // set the variable letter. We default to "x" if nothing better is provided, but this should probably be updated
      (x[2] === undefined ? "x" : x[2].toLowerCase()), // undefined case will become coefficient * x^0
      // set the exponent. This is also a number we fish out, but should be an integer, not a fraction
      (x[3] === undefined ? (x[2] === undefined ? 0 : 1) : parseInt(x[3].replace(/\s/g, "")))
    ));
    const polynomialTermSet = new PolynomialTermSet(terms);
    return polynomialTermSet;
  }
}

// Google Chrome won't run module based code from files for security reasons
// export { doMatrixStuff }
// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class PolynomialInputValidator {
  constructor(tokenizer) {
    // Tokenizer is used to parse strings to token arrays
    this.tokenizer = tokenizer;

    // The regex below captures all individual letters from a string
    // Given "2xy + 3z - 4w", captures "x", "y" and "w"
    this.individualLetterCaptureRegex = /([a-zA-Z]{1})/g;

    // The regexes below identify relatively simple patterns. They are used to
    // determine whether a string does or does not contain the defined pattern.
    this.multiLetterSequenceRegex = /[A-Za-z]{2}/;
    this.letterFollowedByNumeralRegex = /[a-zA-Z][0-9]/;
    this.fractionRegex = /\d+\s*[/]/;
  }

  hasMultipleDifferentLetters(input) {
    // Check for multiple different letters anywhere in the input value.
    // Capture tokens represent individual letter characters.
    // Each captured token is itself an array. For string "x + y", 
    // the first captured token is ["x", "x", index: 0, input: "x + y", groups: undefined].
    // The second captured token is ["y", "y", index: 4, input: "x + y", groups: undefined]
    const singleLetterTokens = this.tokenizer.tokenize(input, this.individualLetterCaptureRegex);

    // Analyze to see if captured single letter tokens are all the same or different  
    let multipleLettersFound = false;
    let lastExaminedLetter = null;

    singleLetterTokens.forEach(singleLetterToken => {
      const currentLetter = singleLetterToken[0];
      if ((lastExaminedLetter !== null) && (lastExaminedLetter.toLowerCase() !== currentLetter.toLowerCase())) {
        multipleLettersFound = true;
      }
      lastExaminedLetter = currentLetter;
    });
    return multipleLettersFound;
  }

  hasMultipleLettersInARow(input) {
    // Check for multiple letters in a row, e.g. xx. This will also on its own find patterns
    // like xy, but that will have been caught already by the multi-letter test above.
    return input.match(this.multiLetterSequenceRegex);
  }

  hasLetterFollowedbyNumeral(input) {
    // check for letters followed immediately by numerals, e.g. x4 rather than the correct x^4.
    return input.match(this.letterFollowedByNumeralRegex);
  }

  hasFraction(input) {
    // check for letters followed immediately by numerals, e.g. x4 rather than the correct x^4.
    return input.match(this.fractionRegex);
  }

  getInputValidationStatus(input) {
    let result = "Valid";
    if (this.hasMultipleDifferentLetters(input)) {
      result = "Invalid: Cannot use two different variable letters";
      return result;
    }
    if (this.hasMultipleLettersInARow(input)) {
      result = "Invalid: Cannot have two letters in sequence";
      return result;
    }
    if (this.hasLetterFollowedbyNumeral(input)) {
      result = "Invalid: Exponents must be separated from variables by the ^ character";
      return result;
    }
    if (this.hasFraction(input)) {
      result = "Invalid: Fractional coefficients or exponents are not allowed";
      return result;
    }
    return result;
  }

}

// Google Chrome won't run module based code from files for security reasons
// export { PolynomialParser }
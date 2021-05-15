/* eslint-disable no-unused-vars, no-undef */

// Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class RegexPatterns {
  constructor() {
    // The regex below captures all individual polynomial terms from one polynomial string
    // Given "2x^5 - 4/5x^3 + 4x - 4", captures "2x^5", " - 4/5x^3", " + 4x", and " - 4"
    // Each capture gets the entire term along with three sub-segments defined via capture groups ()
    //     (\s*[\+-]?\s*\d*[/]?\d*)    captures the coefficient       e.g. "2", " - 4/5", " + 4", " - 4"
    //     (\s*x)?                     captures the variable letter   e.g. "x", "x", "", "x"
    //     (?:\s*\^\s*([\+-]?\s*\d+))? identifies an exponent segment e.g. "^5", "^3", "", ""
    //                ([\+-]?\s*\d+)   captures the numeric exponent  e.g. "5", "3", "", ""
    this.polynomialTermRegex = /(\s*[+-]?\s*\d*[/]?\d*)(\s*[a-zA-Z])?(?:\s*\^\s*([+-]?\s*\d+))?/gi;

    // The regex below captures all the whole polynomials between parentheses in a string
    // Given "(2x^3 - 5)(4x + 4)", captures "2x^3 - 5" and "4x + 4"
    this.polynomialBetweenParenthesesRegex = /\(([^)]+)\)/g;

    // The regex below determines whether either a left or right parenthesis exists in a string.
    this.hasParenthesesRegex = /[()]/g;

    // The regex below captures all individual letters from a string
    // Given "2xy + 3z - 4w", captures "x", "y" and "w"
    this.individualLetterCaptureRegex = /([a-zA-Z]{1})/g;

    // The regexes below identify relatively simple patterns used in substring
    // replacement, or to determine whether a string contain a certain pattern.
    this.multiLetterSequenceRegex = /[A-Za-z]{2}/;
    this.letterFollowedByNumeralRegex = /[a-zA-Z][0-9]/;
    this.fractionRegex = /\d+\s*[/]/;
    this.whitespaceRegex = /\s/g;
  }

}

// Chrome won't run module based code from files for security reasons
// export { PolynomialParser }
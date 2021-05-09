// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

class Tokenizer {
  constructor() {
  }

  tokenize(str, regex) {
    // Uses a regex to read one or more tokens from a string into an array.
    // For example, we use this to pull polynomial terms from a polynomial string.
    // Tkens are themselves arrays whose zero-index item is the captured pattern match,
    // and whose other items are sub-matches within that isolated using regex capture grups.

    // With some modiication by me to add the result array, this code was generated by an online tool at
    // https://regex101.com/

    // Another useful tool that will diagram your regex is at
    // https://regexper.com/

    // Further resources
    // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    let tokens = [];
    let token;
    while ((token = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (token.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // Only push the captured token if it is non-empty
      if (token[0] !== "") tokens.push(token);
    }
    return tokens;
  }

}

// Google Chrome won't run module based code from files for security reasons
// export { PolynomialParser }
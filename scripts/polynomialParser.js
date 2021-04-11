// Google Chrome won't run module based code from files for security reasons
// import { allFactorsOf } from './factor.js'

/*
Rules: What ISN'T a Polynomial
There are a few rules as to what polynomials cannot contain:

Polynomials cannot contain division by a variable.
For example, 2y2+7x/4 is a polynomial, because 4 is not a variable. However, 2y2+7x/(1+x) is not a polynomial as it contains division by a variable.

Polynomials cannot contain negative exponents.
You cannot have 2y-2+7x-4. Negative exponents are a form of division by a variable (to make the negative exponent positive, you have to divide.) For example, x-3 is the same thing as 1/x3.

Polynomials cannot contain fractional exponents.
Terms containing fractional exponents (such as 3x+2y1/2-1) are not considered polynomials.

Polynomials cannot contain radicals.
For example, 2y2 +√3x + 4 is not a polynomial.

From <https://owlcation.com/stem/What-Is-a-Polynomial> 
*/

/*
Something cool to add to this class - ability to generate from an array of factors. Can we have more than one constructor?
Found at https://stackoverflow.com/questions/43074714/how-to-calculate-coefficients-of-polynomial-expansion-in-javascript

Start with an array of pairs like [[1, 3], [1, 1], [1, 2]].

Use the factors as vector and use a cross product for the result.

function multiply(a1, a2) {
    var result = [];
    a1.forEach(function (a, i) {
        a2.forEach(function (b, j) {
            result[i + j] = (result[i + j] || 0) + a * b;
        });
    });
    return result;
}

var data = [[1, 3], [1, 1], [1, 2]], // (1+3x)(1+x)(1+2x)
result = data.reduce(multiply);
console.log(result);                 // [1, 6, 11, 6] = 1x^0 + 6x^1 + 11x^2 + 6x^3
*/

/*
Tokenizing example for input processing. This is a simple calculator that does +, -, /, * so not the same but still interesting
http://jorendorff.github.io/calc/docs/calculator-parser.html
*/
//function tokenize(code) {
//    var results = [];
//    var tokenRegExp = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;

//    var m;
//    while ((m = tokenRegExp.exec(code)) !== null)
//        results.push(m[1]);
//    return results;
//}

/*
https://www.freecodecamp.org/news/how-to-build-a-math-expression-tokenizer-using-javascript-3638d4e5fbe9/
*/

class PolynomialParser {

  constructor() {
    this.singlePolynomialRegex = /(\s*[\+-]?\s*\d*)(\s*x)?(?:\s*\^\s*([\+-]?\s*\d+))?/gi;
    //this.regexWithoutCaptureGroups = /([\+-]?\d*)(?:x(?:\^[\+-]?\d+)?)?/gi
    this.multiPolynomialRegex = /\(([^)]+)\)/g;
    //this.multiPolynomialRegex = /\(([^\)])\)/g; Corrupted the regex! Stopped working! Doesn't pick up multi-chars in parens.
    //this.multiPolynomialRegex = /\((.*)\)/g; picks up single polys in parens but mashes multi polys together into one bogus one
    this.multiLetterSequenceRegex = /[A-Za-z]{2}/;
  }

  getInputValidationStatus(input) {
    let result = "Valid";
    if (input.match(this.multiLetterSequenceRegex)) {
      result = "Invalid: Cannot have two letters in sequence";
    }
    return result;
  }

  parseInputToTermSets(input) {
    //console.log("Parse input");
    //console.log(input);
    let polynomialStrings = this.parseInputToPolynomialStrings(input);
    //console.log("parsed whole polynomials");
    //console.log(polynomialStrings);
    let polynomialTermSets = polynomialStrings.map(polynomialString => this.parsePolynomialStringToTermSet(polynomialString));
    console.log("parsed polynomial term sets");
    console.log(polynomialTermSets);
    return polynomialTermSets;
  }

  parsePolynomialStringToTermSet(input) {
    //console.log("Tokens with capture groups");
    let tokens = this.tokenize(input, this.singlePolynomialRegex);
    //console.log(tokens);

    //console.log("Term set cleaned up as objects");
    let termSet = this.tokensToTermSet(tokens);
    //console.log(tokenObjects);

    return termSet;
  }

  parseInputToPolynomialStrings(input) {

    console.log("Parse input to polynomial strings input:");
    console.log(input);

    let result = [];
    if (!input.match(/[\(\)]/g)) { //this.multiPolynomialRegex)) {
      // If no parentheses found, assume only one polynomial
      // Return the entire input string as a single-element array
      console.log("No parentheses found");
      result.push(input);
    }
    else {
      // Even if no right parenthesis exists we still use this branch
      // We won't find anything if the user has typed only partial input
      console.log("Parenthesis found");
      if (input.match(this.multiPolynomialRegex)) {
        console.log("Double parentheses found")
      }
      let wholePolynomialTokens = this.tokenize(input, this.multiPolynomialRegex); // produces an array of matches
      wholePolynomialTokens.forEach(token => {
        if ((token[0] !== "") && (token[0] !== undefined)) {
          result.push(token[0]);
        }
      })
    }
    console.log("Parse whole polynomials result");
    console.log(result);
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

    //console.log("Tokenize function input:");
    //console.log(str);

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
    //console.log("Tokenize function result:");
    //console.log(tokens);
    return tokens;
  }

  tokensToTermSet(tokens) {
    const terms = tokens.map(x => new PolynomialTerm(
      ((x[1].trim() === "" || x[1].trim() === "+" || x[1].trim() === "-") && x[2] === undefined ? 0 : (x[1].trim() === "" || x[1].trim() === "+" || x[1].trim() === "-") ? parseInt(`${x[1].replace(/\s/g, "")}1`) : parseInt(x[1].replace(/\s/g, ""))),
      (x[2] === undefined ? "x" : x[2].toLowerCase()), // undefined case will become coefficient * x^0
      (x[3] === undefined ? (x[2] === undefined ? 0 : 1) : parseInt(x[3].replace(/\s/g, "")))
    ));
    const polynomialTermSet = new PolynomialTermSet(terms);
    return polynomialTermSet;
  }
  /*
    clone(objectToClone) {
      //console.log("object to be cloned");
      //console.log(objectToClone);
      const clonedObject = Object.assign(
        Object.create(
          Object.getPrototypeOf(objectToClone)
        ),
        objectToClone);
      //console.log("cloned object");
      //console.log(clonedObject);
      return clonedObject;
    }
  */
  /*
   combineLikeTerms(terms) {
     // In order not to experience problematic side effects we iterate our original array
     // and push shallow clones as needed to a new array. However, the basic syntactic
     // patterns for shallow copying objects, such as Object.assign or { ...objectToCopy}
     // don't completely work for custom class instances with methods. The methods, in 
     // particular, don't get copied to the new object. So we use an object copy function
     // derived from that documented at https://www.nickang.com/2018-01-17-how-to-clone-class-instance-javascript/
     let termsConsolidated = [];
     terms.forEach(current => {
       if (termsConsolidated.length === 0) {
         termsConsolidated.push(current.clone()); // Important to push a clone of the item, not the same in-memory item
         //termsConsolidated.push(this.clone(current)); // Important to push a clone of the item, not the same in-memory item
       } else {
         let found = termsConsolidated.find(existing => existing.exponent === current.exponent);
         if (found === null || found === undefined) {
           termsConsolidated.push(current.clone()); // Important to push a clone of the item, not the same in-memory item
           //termsConsolidated.push(this.clone(current)); // Important to push a clone of the item, not the same in-memory item
         } else {
           found.coefficient = found.coefficient + current.coefficient;
         }
       }
     });
     //console.log("combineLikeTerms function result:");
     //console.log(termsConsolidated);
     return termsConsolidated;
   }
 
   injectZeroCoefficientTerms(terms) {
     let leadingTerm = terms.sort((a, b) => b.exponent - a.exponent)[0];
     if (terms.length > 0) {
       const polynomialDegree = leadingTerm.exponent;
       const variable = leadingTerm.variable;
       for (let testExponent = polynomialDegree; testExponent >= 0; testExponent--) {
         if (!terms.find(existing => existing.exponent === testExponent)) {
           terms.push(new PolynomialTerm(0, variable, testExponent));
         }
       }
     }
     let termsSorted = terms.sort((a, b) => b.exponent - a.exponent);
     //console.log("injectZeroCoefficientTerms function result:");
     //console.log(termsSorted);
     return (termsSorted);
   }
 */
}
// Google Chrome won't run module based code from files for security reasons
// export { doMatrixStuff }
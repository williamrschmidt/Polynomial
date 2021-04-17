
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


Tokenizing example for input processing. This is a simple calculator that does +, -, /, * so not the same but still interesting
http://jorendorff.github.io/calc/docs/calculator-parser.html

//function tokenize(code) {
//    var results = [];
//    var tokenRegExp = /\s*([A-Za-z]+|[0-9]+|\S)\s*/g;

//    var m;
//    while ((m = tokenRegExp.exec(code)) !== null)
//        results.push(m[1]);
//    return results;
//}


https://www.freecodecamp.org/news/how-to-build-a-math-expression-tokenizer-using-javascript-3638d4e5fbe9/

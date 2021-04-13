
// Variation on source found at http://javascripter.net/math/primes/factorization.htm
// That source returns the factors in a string, e.g. '3*3*5' for the number 45.
// We return the factors in an array: 45 => [3,3,5], which is much more useful. 
// Negative numbers are factored by including -1 in the return array with the
// positive prime factors of the number's absolute value: -45 => [-1,3,3,5].
function primeFactorsOf(n) {
  let factors = [];
  if (isNaN(n) || !isFinite(n) || n % 1 != 0 || n == 0) factors.push(n);

  if (n < 0) {
    // If the number given to be factored is negative, we account for that by pushing -1 
    // to our output array, then treating n as a positive number for all further factoring.
    factors.push(-1);
    n = math.abs(n);
  }

  let minFactor = leastFactor(n);
  do {
    factors.push(minFactor);
    n = n / minFactor;
    minFactor = leastFactor(n)
  }
  while (n > 1)

  return factors;
}

// Find the least factor in n by trial division
// Source: http://javascripter.net/math/primes/factorization.htm
function leastFactor(n) {
  if (isNaN(n) || !isFinite(n)) return NaN;
  if (n == 0) return 0;
  if (n % 1 || n * n < 2) return 1;
  if (n % 2 == 0) return 2;
  if (n % 3 == 0) return 3;
  if (n % 5 == 0) return 5;
  var m = Math.sqrt(n);
  for (var i = 7; i <= m; i += 30) {
    if (n % i == 0) return i;
    if (n % (i + 4) == 0) return i + 4;
    if (n % (i + 6) == 0) return i + 6;
    if (n % (i + 10) == 0) return i + 10;
    if (n % (i + 12) == 0) return i + 12;
    if (n % (i + 16) == 0) return i + 16;
    if (n % (i + 22) == 0) return i + 22;
    if (n % (i + 24) == 0) return i + 24;
  }
  return n;
}

// Given a prime factorization of a number, find all possible products of those primes.
// Example: 42 has prime factors 2, 3, 7, so this function would take those three
// numbers and produce an array containing 2*2, 2*3, 2*7, 3*2, 3*3, 3*7, 7*2, 7*3, 7*7, 2*3*7.
// We also add the number 1 to our output, since 1 is a factor of any other number.
// That's kind of a kludge, but poor little 1 has to get in there somehow or other.
// Note that some of these products produce the same results (e.g. 2*3 = 3*2), so the output 
// contains duplicates. It is up to the caller to deal with or eliminate these duplicates.
const possibleProductsOf = (arr = []) => {
  const combine = (sub, ind) => {
    let result = [];
    let i, l, p;
    for (i = ind, l = arr.length; i < l; i++) {
      p = sub.slice(0);
      p.push(arr[i]);
      result = result.concat(combine(p, i + 1));
      result.push(p.reduce((accum, val) => { return accum * val; }, 1));
    };
    return sort(result);
  }
  return combine([], 0).concat([1]);
};

// Deduplicates any array by making a set from the array, then converting back to array.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// However it does not seem to work with the fraction objects we are using here.
function deduplicate_Does_Not_Work_For_JSFraction_Objects(arr) {
  let uniqueValues = Array.from(new Set(arr));
  return uniqueValues;
}

// Use this to deduplicate an array of fractional numbers.
function deduplicate(arr) {
  return arr.reduce((uniqueValues, currentValue) => {
    // Try to find the current Value being processed in the array.
    // Here we use math.equal to compare fractions to each other.
    let currentValueIsDuplicate = uniqueValues.find(uniqueValue => math.equal(uniqueValue, currentValue))
    if (!currentValueIsDuplicate) {
      return uniqueValues.concat([currentValue]);
    } else {
      return uniqueValues;
    }
  }, []);
}

// Sorts an array in descending order. (a, b) => b - a specifies that ordering.
function sort(arr) {
  return arr.sort((a, b) => b - a);
}

// Gets all distinct factors, whether prime or not, of an integer
function allFactorsOf(n) {
  return sort(deduplicate(possibleProductsOf(primeFactorsOf(n))));
}

// Google Chrome won't run module based code from files for security reasons
// Export the primary functions that are intended for external use.
// export { primeFactorsOf, allFactorsOf }
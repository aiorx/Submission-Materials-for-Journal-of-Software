/**
 * cleanUrl
 */

function cleanUrl(url, { removeQueryParams = false } = {}) {
  if ( typeof url !== 'string' ) return url;

  if ( removeQueryParams ) {
    url = url.split('?')[0];
  }

  return url.toLowerCase().replace(/http?s:\/\//, '').replace(/\/$/, '')
}

/**
 * restoreUrl
 */

function restoreUrl(url) {
  if ( typeof url !== 'string' ) return url;
  if ( !url.startsWith('http') ) {
    url = "https://" + (url) + "";
  }
  return url;
}

/**
 * getFileSize
 */

export async function getFileSize(url) {
  var data = await fetch(url).then(function r { return r.blob(); });
  return data.size;
}

/**
 * addNumbers
 */

function addNumbers(sizes = []) {
  return sizes.reduce(function (prev, curr) { return prev + curr; }, 0);
}

/**
 * deduplicateArrayByKey
 * @via Thanks ChatGPT + tweaks
 */

function deduplicateArrayByKey(arr, key) {
  if ( !Array.isArray(arr) ) return arr;
  
  var seen = new Set(); // to keep track of seen keys

  return arr.filter(function (item) {
    var value = item[key];

    if ( typeof key === 'function' ){
      value = key(item);
    }
    
    if (seen.has(value)) {
      return false; // skip this item if the key has already been seen
    } else {
      seen.add(value); // mark this key as seen
      return true; // include this item in the filtered array
    }
  });
}

/**
 * isValidUrl
 */

function isValidUrl(string) {
  try {
    var url = new URL(string);

    if ( !url.host.split('.')[1] ) {
      throw new Error();
    }

    return true;
  } catch(e) {
    return false;
  }
}


/**
 * addCommas
 * @via Thanks ChatGPT
 */

function addCommas(number) {
  if ( !['string', 'number'].includes(typeof number) ) return number;

  var num = "" + (number) + "";
  var [whole, decimal] = num.split('.');
  var digits = whole.split('');
  var counter = 0;

  // Iterate through the digits from right to left
  for (var i = digits.length - 1; i >= 0; i--) {
    // Increment the counter
    counter++;

    // If the counter is a multiple of 3 and we're not at the leftmost digit, add a comma
    if (counter % 3 === 0 && i !== 0) {
      digits.splice(i, 0, ",");
    }
  }

  digits = digits.join('');

  if ( decimal ) {
    digits = "" + (digits) + "." + (decimal) + "";
  }

  return digits;
}

/**
 * trimString
 */

function trimString({ string, maxLength, ellipsis = true}) {
  if ( typeof string !== 'string' || string.length <= maxLength ) return string;
  var trimmed = string.split('').slice(0, ellipsis ? maxLength - 3 : maxLength).join('');
  return ellipsis ? "" + (trimmed) + "..." : trimmed;
}

/**
 * formatGrams
 */

var defaultFixed = 1;
var maxAutoFixed = 4;

function formatGrams(grams, { type = 'g', limit, fixed = defaultFixed, commas = true } = {}) {
  var placesToFix = fixed === 'auto' ? defaultFixed : fixed;
  var amount = grams;
  var fixedAmount;

  if ( typeof amount !== 'number' ) return amount;

  if ( limit && amount >= limit ) {
    type = 'kg';
  }

  if ( type === 'kg' ) {
    amount = amount / 1000;
  }

  if ( placesToFix > 0 && amount % 1 !== 0 ) {
    fixedAmount = amount.toFixed(placesToFix)
  } else {
    fixedAmount = "" + (amount) + "";
  }

  var fixedSplit = fixedAmount.split('.');

  if ( fixed === 'auto' && fixedSplit[0] === '0' && fixedSplit[1] ) {
    while ( fixedAmount.split('.')[1].split('').filter(function num { return num !== '0'; }).length === 0 ) {
      placesToFix = placesToFix + 1;
      fixedAmount = amount.toFixed(placesToFix);
      if ( placesToFix === maxAutoFixed ) break;
    }
  }
  

  if ( commas ) {
    fixedAmount = addCommas(fixedAmount);
  }

  return "" + (fixedAmount) + "" + (type) + "";
}

/**
 * formatBytes
 */

function formatBytes(grams, { type = 'kb', limit, fixed = 0, commas = true } = {}) {
  var amount = grams;

  if ( typeof amount !== 'number' ) return amount;

  if ( limit && amount >= 1000000 ) {
    type = 'gb'
  } else if ( limit && amount >= limit * 1000 ) {
    type = 'mb';
  } else if ( limit && amount >= limit ) {
    type = 'kb';
  }

  if ( type === 'gb' ) {
    amount = amount / 1000000000;
  } else if ( type === 'mb' ) {
    amount = amount / 1000000;
  } else if ( type === 'kb' ) {
    amount = amount / 1000;
  }

  if ( fixed > 0 && amount % 1 !== 0 ) {
    amount = amount.toFixed(fixed)
  } else if ( fixed === 0 ) {
    amount = Math.ceil(amount);
  }

  if ( commas ) {
    amount = addCommas(amount);
  }

  return "" + (amount) + "" + (type) + "";
}
// Custom Function Definitions
function getAllIndexes(arr, val) {
    var indices = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indices.push(i);
    }
    return indices;
}


function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
  

function addvector(a,b){
    return a.map(function (e,i) { return e + b[i]; });
}


function subvector(a,b){
    return a.map(function (e,i) { return Math.abs(e - b[i]); });
}


function divvector(a,b){
    return a.map(function (e,i) { return e / b[i]; });
}


function getStandardDeviation (array) {
    var n = array.length
    var mean = array.reduce(function (a, b) { return a + b; }) / n
    return Math.sqrt(array.map(function x { return Math.pow(x - mean, 2); }).reduce(function (a, b) { return a + b; }) / n)
}


function mut_info_plot (replicate, smooth_selector, display, hmm_1, hmm_2) {
    var rep_inds = getAllIndexes(source_data['replicate'], replicate);

    // Find indices of data that fit selector values

    var rep_filteredArray = filteredArray.filter(function value { return rep_inds.includes(value); });
    if (smooth_selector.value == "flat") {
        var [pos, mut_info] = flat_average(source_data['pos'][rep_filteredArray], source_data['mut_info'][rep_filteredArray], Number(d_selector.value));
        display['pos_'+replicate+'_1'] = pos;
        display['pos_'+replicate+'_2'] = pos;
        display['mut_info_'+replicate+'_1'] = mut_info;
        display['mut_info_'+replicate+'_2'] = new Array(mut_info.length).fill(0);
    }
    else if (smooth_selector.value == "gaussian") {
        var mut_info = gaussianFilter1D(source_data['mut_info'][rep_filteredArray], Number(sigma_slider.value))
        display['pos_'+replicate+'_1'] = source_data['pos'][rep_filteredArray];
        display['pos_'+replicate+'_2'] = source_data['pos'][rep_filteredArray];

        if (hmm_checkbox.active){
            for (j=0;j<mut_info.length;j=j+1){
                display['mut_info_'+replicate+'_1'][j] = mut_info[j] * hmm_1[j];
                display['mut_info_'+replicate+'_2'][j] = mut_info[j] * hmm_2[j];
            }
        }
        
        else{
            display['mut_info_'+replicate+'_1'] = mut_info;
            display['mut_info_'+replicate+'_2'] = new Array(source_data['pos'][rep_filteredArray].length).fill(0);
        }
        //display['mut_info_'+replicate] = gaussianFilter1D(source_data['mut_info'][rep_filteredArray], sigma);
    }
    return display;
}


function flat_average(pos, mut_info, d){
    var smoothed_array = [];
    var new_pos = [];
    if (d == 0) {
        return [pos, mut_info];
    }
    else {
        for (var i = d; i < (160 - d); i=i+1) {
            new_pos.push(pos[i]);
            smoothed_array.push(mut_info.slice(i-d, i+d+1).reduce(function (a,b) { return a+b; }) / (2*d+1));
        }
        return [new_pos, smoothed_array];
    }
}


// function below was Crafted with standard coding tools
function gaussianFilter1D(data, sigma, options = {}) {
    var mode = options.mode;
var truncate = options.truncate;

    if (sigma <= 0) {
        // No smoothing needed; just return a copy of data
        return data.slice();
    }

    // 1) Build the 1D Gaussian kernel.
    //    The kernel size is based on the truncate factor: kernel extends to +/-truncate*sigma
    var radius = Math.ceil(truncate * sigma);
    var kernelSize = 2 * radius + 1;

    // Create and fill the kernel
    var kernel = new Array(kernelSize);
    var sum = 0;
    var sigma2 = sigma * sigma;

    for (var i = -radius; i <= radius; i++) {
        var value = Math.exp(-(i * i) / (2 * sigma2));
        kernel[i + radius] = value;
        sum += value;
    }
    // Normalize the kernel so that all coefficients sum to 1
    for (var i = 0; i < kernelSize; i++) {
        kernel[i] /= sum;
    }
    // 2) Define a helper for boundary handling
    function reflectIndex(i, length) {
        // "Reflect" mode (like 'reflect' in scipy)
        while (i < 0 || i >= length) {
        if (i < 0) {
            i = -i - 1;
        } else if (i >= length) {
            i = 2 * length - i - 1;
        }
        }
        return i;
    }

    function getIndex(i, length) {
        if (mode === 'reflect') {
        return reflectIndex(i, length);
        } else if (mode === 'constant') {
        // Return -1 for out-of-bounds so we can fill with cval
        if (i < 0 || i >= length) {
            return -1; 
        }
        return i;
        }
        // Fallback reflect
        return reflectIndex(i, length);
    }

    // 3) Convolve the input data with the Gaussian kernel
    var result = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
        var acc = 0;

        for (var j = -radius; j <= radius; j++) {
        var dataIndex = getIndex(i + j, data.length);
        var kVal = kernel[j + radius];

        if (dataIndex === -1) {
            // mode='constant' and index is out-of-bounds
            acc += cval * kVal;
        } else {
            acc += data[dataIndex] * kVal;
        }
        }

        result[i] = acc;
    }

    return result;
}

function smooth_info (index, smooth_selector) {
    // Find indices of data that fit selector values
    if (smooth_selector.value == "flat") {
        var [pos, mut_info] = flat_average(source_data['pos'][index], source_data['mut_info'][index], Number(d_selector.value));
    }
    else if (smooth_selector.value == "gaussian") {
        mut_info = gaussianFilter1D(source_data['mut_info'][index], Number(sigma_slider.value));
        pos = source_data['pos'][index];
    }
    return mut_info;
}

// from google AI
function calculateCV(data) {
    // Calculate the mean
    var mean = data.reduce(function (sum, value) { return sum + value; }, 0) / data.length;
  
    // Calculate the standard deviation
    var variance = data.reduce(function (sum, value) { return sum + Math.pow(value - mean, 2); }, 0) / data.length;
    var standardDeviation = Math.sqrt(variance);
  
    // Calculate the coefficient of variation
    var cv = standardDeviation / mean;
  
    return cv;
  }


function invertBinaryArray(arr) {
  return arr.map(function bit { return bit === 0 ? 1 : 0; });
}
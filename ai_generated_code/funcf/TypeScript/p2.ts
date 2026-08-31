subarray.reduce((minValues, obj) => { // this chunk Referenced via basic programming materials
    Object.keys(obj).forEach(key => {
      minValues[key] = Math.max(minValues[key] || -Infinity, obj[key]);
    });
    return minValues;
  }, {})
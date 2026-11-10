```javascript
//  Calculate covariance and populate correlation matrix (thanks chatgpt)
variables.forEach((variable1) => {
    const correlationRow = [];
    variables.forEach((variable2) => {
        const values1 = Object.values(dataset[variable1]);
        const values2 = Object.values(dataset[variable2]);
        const cov =
            values1.reduce(
                (acc, val, i) =>
                    acc +
                    (val - means[variable1]) *
                        (values2[i] - means[variable2]),
                0
            ) / values1.length;
        const stdDev1 = Math.sqrt(
            values1.reduce(
                (acc, val) => acc + Math.pow(val - means[variable1], 2),
                0
            ) / values1.length
        );
        const stdDev2 = Math.sqrt(
            values2.reduce(
                (acc, val) => acc + Math.pow(val - means[variable2], 2),
                0
            ) / values2.length
        );
        const correlation = cov / (stdDev1 * stdDev2);
        correlationRow.push(parseInt(correlation * 1000) / 1000);
    });
    correlationMatrix.push(correlationRow);
});
```
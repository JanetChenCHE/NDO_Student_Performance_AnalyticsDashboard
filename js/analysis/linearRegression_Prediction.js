class LINEARREGRESSION_PREDICTION {
    // constructor

    //method
    linearRegression(xs, ys) {
        // Reference: https://math.berkeley.edu/~scanlon/m16bs04/ln/16b2lec5.pdf
    
        // Linear Regression Equation: y = mx + b
        // y = dependent variable
        // x = independent variable (predictor)
        // m = estimated slope
        // b = estimated intercept
    
        // xs: array of x-values (years)
        // ys: array of y-values (scores)
        const n = xs.length;
        // acc = accumulator
        // val = currentValue
        // idx = index
        const sumX = xs.reduce((acc, val) => acc + val, 0);
        const sumY = ys.reduce((acc, val) => acc + val, 0);
        const sumX2 = xs.reduce((acc, val) => acc + val * val, 0);
        const sumXY = xs.reduce((acc, val, idx) => acc + val * ys[idx], 0);
    
        // slope = m = [n(Σxy) - (Σx)(Σy)] / [n(Σx^2) - (Σx)^2]
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        // intercept = b = [(Σy) - m(Σx)] / n
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    }
    
    predictNaNValues(data) {
        const currentYear = new Date().getFullYear();
        // Separate years and scores into two arrays
        let years = [];
        let scores = [];
        for (let i = 0; i < data.length; i++) {
            if (!isNaN(data[i][1])) { // Filter out NaN values
                years.push(data[i][0]);
                scores.push(data[i][1]);
            }
        }
    
        // Perform linear regression
        const { slope, intercept } = this.linearRegression(years, scores);
    
        // Predict NaN values
        for (let i = 0; i < data.length; i++) {
            if(data[i][0] > currentYear) {
                if (isNaN(data[i][1])) { // If the value is NaN, predict it
                    // Linear Regression Prediction
                    // y = mx + b
                    const predictedScore = Number((slope * data[i][0] + intercept).toFixed(2));
                    if(predictedScore < 0) {
                        data[i][1] = 0;
                    }
                    else if(predictedScore > 6) {
                        data[i][1] = 6;
                    }
                    else {
                        data[i][1] = predictedScore;
                    }
                }
            }
        }
    
        return data;
    }
}

export { LINEARREGRESSION_PREDICTION };
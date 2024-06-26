

class CORRELATION {
    // constructor

    //method
    //Function: Calculate the correlation
    calculateCorrelation(data1, data2) {

        // Step 1: Calculate the mean of each dataset
        const mean1 = data1.reduce((acc, curr) => acc + curr.value, 0) / data1.length;
        const mean2 = data2.reduce((acc, curr) => acc + curr.value, 0) / data2.length;
    
        // Step 2: Calculate the covariance
        let covariance = 0;
        for (let i = 0; i < data1.length; i++) {
        covariance += (data1[i].value - mean1) * (data2[i].value - mean2);
        }
        covariance /= data1.length;
    
        // Step 3: Calculate the standard deviation of each dataset
        const stdDev1 = Math.sqrt(data1.reduce((acc, curr) => acc + Math.pow(curr.value - mean1, 2), 0) / data1.length);
        const stdDev2 = Math.sqrt(data2.reduce((acc, curr) => acc + Math.pow(curr.value - mean2, 2), 0) / data2.length);
    
        // Step 4: Calculate the Pearson correlation coefficient
        const correlationCoefficient = covariance / (stdDev1 * stdDev2);
        
        return correlationCoefficient;
    }
}

export { CORRELATION };

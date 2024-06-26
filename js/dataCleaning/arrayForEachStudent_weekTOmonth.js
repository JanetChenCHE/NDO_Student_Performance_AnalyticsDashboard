// data from outside:
// - data

// create array
// - data_monthly
// - dataArray
// - data_month_uniq

class array_monthly_EachStudent {
    //constructor
    
    //method
    arrangeArray_OS(data) {
        let dataArray1 = [];
        let dataArray2 = [];
        let data_monthly = [];
        let data_month_uniq = [];
        let currentMonth = '';
        let temp1 = 0;
        let count = 0;
        // push NAME & YEAR
        data_monthly.push(data[0]);
        // Iterate through each element in data[1]
        for (let i = 0; i < data[1].length; i++) {
            const currentData = data[1][i];
            let isUnique = true;

            // Check if the current element is already present in data_monthly
            for (let j = 0; j < data_month_uniq.length; j++) {
                const existingData = data_month_uniq[j];

                // Check if the current data is equal to any existing data
                if (currentData === existingData) {
                    isUnique = false;
                    break;
                }
            }

            // If the current data is unique, push it to data_monthly
            if (isUnique) {
                data_month_uniq.push(currentData);
            }
        }
        data_monthly.push(data_month_uniq);


        // push data which is average value
        for(let j=2; j<data.length;j++) {
            currentMonth = '';
            for(let i=0; i<data[1].length;i++) {
                if(currentMonth === '') {
                    currentMonth = data[1][i];
                }
                else if(data[1][i] !== currentMonth || i === data[1].length - 1) {
                    if(j===2) {
                        // ENGLISH KPI
                        temp1 = temp1/count; //OS
                        dataArray1.push({ OS: Number(temp1.toFixed(2)) });
                        temp1 = 0;
                    }
    
                    count = 0;
                    currentMonth = data[1][i];
                }
                // count averange mark
                const score_English = data[2][i];
                if(j===2  && !isNaN(parseFloat(Object.values(score_English)))) { 
                    if('OS' in score_English) {
                        const osScore = score_English.OS;
                        temp1 += osScore;
                        count++;
                    }
                }
            }
        }
        data_monthly.push(dataArray1);
        


        // write the month in combined array in correct ammount
        let newArray1 = [];
        let currentMonthIndex = -1;
        for (let i = 0; i < data_monthly[2].length; i++) {
            const obj = data_monthly[2][i];
            if ('OS' in obj) {
                currentMonthIndex++;
                newArray1.push(data_monthly[1][currentMonthIndex]);
            } else {
                newArray1.push(data_monthly[1][currentMonthIndex]);
                if (currentMonthIndex >= data_monthly[1].length) {
                currentMonthIndex = 0; // Restart from the beginning if end of months array is reached
                }
            }
        }
        data_monthly[1] = newArray1;
        return data_monthly;
    }

    arrageArray_returnWithoutObject(data) {
        let currentMonth;
        let preMonth = '';
        let currentsub;
        let presub = '';
        let os_count = 0;
        let data_array1 = [];
        let data_array2 = [];
        let new_data = [];

        
        // get the correct month
        for (let i=2; i<data[0].length; i++) {
            currentMonth = data[0][i];
            currentsub = data[2][i];
            if((preMonth === '' && presub === '') || currentMonth !== preMonth) {
                preMonth = currentMonth;
                presub = currentsub; 
                data_array1.push(currentMonth);
                data_array2.push(currentsub);
                os_count = 1;
            }
            else if(currentMonth === preMonth) {
                if(os_count >= 2) {
                    continue;
                }
                if(currentsub === 'OS') {
                    os_count++;
                }
                else {
                    data_array1.push(currentMonth);
                    data_array2.push(currentsub);
                }
            }
        }
        new_data.push(data_array1);
        new_data.push(data_array2);
        data_array1=[];
        data_array2=[];

        //get the value
        for(let a=3; a<data.length; a++) { //data (each student)
            for(let i=0; i<new_data[0].length; i++) { //new_data: month & sub
                let count = 0;
                let temp = 0;
                currentMonth = new_data[0][i];
                currentsub = new_data[1][i];
                for(let b=2; b<data[0].length; b++) { // data
                    if (data[0][b] === currentMonth && data[2][b] === currentsub) {
                        temp = temp + Number(data[a][b]);
                        count++;
                    }
                    else {
                        continue;
                    }
                }
                temp = temp/count;
                data_array1.push(Number(temp.toFixed(2)));
            }
            new_data.push(data_array1);
            data_array1=[];
        }

        // Include the first two entire columns of data into first two columns of new_data
        for (let i = 0; i < new_data.length; i++) {
            if (Array.isArray(new_data[i])) {
                new_data[i].unshift(data[i+1][0], data[i+1][1]);
            }
        }

        // Data cleaning: Replace "second row" "first column" - new_data[1][0] to "CLASS"
        new_data[1][0] = 'CLASS';

        return new_data;
    }

    replaceNaNWithMean(data) {
        // Transpose the 2D array to operate on columns
        const transposedData = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
    
        // Replace NaN values with the mean of non-NaN values for each column
        const replacedColumns = transposedData.map(column => {
            // Filter out NaN values and convert remaining values to numbers
            const numbers = column.filter(value => !isNaN(value) && typeof value !== 'string').map(Number);
    
            // Calculate the mean of the non-NaN values with two decimal places precision
            const sum = numbers.reduce((acc, value) => acc + value, 0);
            const mean = (sum / numbers.length).toFixed(2);
    
            // Replace NaN values with the computed mean
            return column.map(value => {
                if (isNaN(value) && typeof value !== 'string') return parseFloat(mean);
                return value;
            });
        });
    
        // Transpose back to the original shape
        const replacedData = replacedColumns[0].map((_, rowIndex) => replacedColumns.map(column => column[rowIndex]));
    
        return replacedData;
    }
}

export { array_monthly_EachStudent }
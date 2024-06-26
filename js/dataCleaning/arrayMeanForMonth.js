class ARRAYMEANFORMONTH {
    //constructor
    
    //method
    countMean(data, value) {
        let currentMonth;
        let arrayTemp = [];
        let array = [];
        let value_row;
        for(let i=0; i<data[1].length; i++){
            if(data[1][i] === 'CLASS') { 
                value_row = i;
            }
        }
        
        let isFirstNonEmptyMonthFound = false;
        
        for(let k=0; k<data[0].length; k++) { //corrected loop index
            let temp = 0;
            let count = 0;
            let mean = 0;
            let subjectMean = {};
            
            if (!data[0][k].trim()) {
                continue; // skip empty months
            }
    
            if (!isFirstNonEmptyMonthFound) {
                let currentMonthName = data[0][k].toUpperCase().trim();
                if (currentMonthName !== 'JANUARY' && currentMonthName !== 'JUNE') {
                    continue; // skip until we find January or June
                } else {
                    isFirstNonEmptyMonthFound = true;
                }
            }
            
            if(data[0][k].trim() && (data[0][k].toUpperCase().trim() === 'JANUARY' && arrayTemp.length === 0) || (data[0][k].toUpperCase().trim() === 'JUNE' && arrayTemp.length === 0)) {
                arrayTemp.push(data[0][k]);
                currentMonth = data[0][k];
            }
            else if(currentMonth !== data[0][k]) { // check only for currentMonth change
                array.push(arrayTemp);
                arrayTemp = [];
                if(data[0][k].trim()) {
                    arrayTemp.push(data[0][k]);
                    currentMonth = data[0][k];
                }
            }
            
            for(let j=0; j<data.length; j++){ //corrected loop index
                if(value !== '') { // if there is no selectedClass, so show average mark of selectedCohort
                    if(data[j][value_row] && data[j][value_row].toUpperCase().trim() === value.toUpperCase().trim()) { //check for empty value
                        // Check if data[j][k] is a number
                        if (!isNaN(parseFloat(data[j][k])) && isFinite(data[j][k])) {
                            temp = temp + Number(data[j][k]);
                            count++;
                        }
                    }
                }
                else {
                    // Check if data[j][k] is a number
                    if (!isNaN(parseFloat(data[j][k])) && isFinite(data[j][k])) {
                        temp = temp + Number(data[j][k]);
                        count++;
                    }
                }
            }
            mean = temp / count;
            subjectMean[data[1][k]] = Number(mean.toFixed(2));
            arrayTemp.push(subjectMean);
        }
    
        // Push the last month's data
        if (arrayTemp.length > 0) {
            array.push(arrayTemp);
        }
    
        return array;
    }  
    
    countMean_teacher(data, value) {
        let currentMonth;
        let arrayTemp = [];
        let array = [];
        let value_row;
        for(let i=0; i<data[1].length; i++){
            if(data[1][i] === 'Students') { 
                value_row = i;
            }
        }
        
        let isFirstNonEmptyMonthFound = false;
        
        for(let k=0; k<data[0].length; k++) { //corrected loop index
            let temp = 0;
            let count = 0;
            let mean = 0;
            let subjectMean = {};
            
            if (!data[0][k].trim()) {
                continue; // skip empty months
            }
    
            if (!isFirstNonEmptyMonthFound) {
                let currentMonthName = data[0][k].toUpperCase().trim();
                if (currentMonthName !== 'JANUARY' && currentMonthName !== 'JUNE') {
                    continue; // skip until we find January or June
                } else {
                    isFirstNonEmptyMonthFound = true;
                }
            }
            
            if(data[0][k].trim() && (data[0][k].toUpperCase().trim() === 'JANUARY' && arrayTemp.length === 0) || (data[0][k].toUpperCase().trim() === 'JUNE' && arrayTemp.length === 0)) {
                arrayTemp.push(data[0][k]);
                currentMonth = data[0][k];
            }
            else if(currentMonth !== data[0][k]) { // check only for currentMonth change
                array.push(arrayTemp);
                arrayTemp = [];
                if(data[0][k].trim()) {
                    arrayTemp.push(data[0][k]);
                    currentMonth = data[0][k];
                }
            }
            
            for (let j = 0; j < data.length; j++) {
                for (let l = 0; l < value.length; l++) {
                    if (data[j][value_row] && data[j][value_row].toUpperCase().trim() === value[l].toUpperCase().trim()) {
                        // Check if data[j][k] is a number
                        if (!isNaN(parseFloat(data[j][k])) && isFinite(data[j][k])) {
                            temp = temp + Number(data[j][k]);
                            count++;
                        }
                        if(isNaN(parseFloat(data[j][k]))) {
                            // console.log(data[j][k], count);

                        }
                    }
                }
            }
            
            mean = temp / count;
            subjectMean[data[1][k]] = Number(mean.toFixed(2));
            arrayTemp.push(subjectMean);
        }
    
        // Push the last month's data
        if (arrayTemp.length > 0) {
            array.push(arrayTemp);
        }
    
        return array;
    }  
}

export{ ARRAYMEANFORMONTH }
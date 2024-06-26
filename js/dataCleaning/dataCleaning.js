class DATACLEANING {
    // constructor

    // methods
    // Function: Data Cleaning
    makeArrayNoObject(data) { // month in the row 2
        let new_data = [];
        let new_data_array = ['month'];
        let currentMonth;
        let preMonth = '';

        const thirdRow = data[2] || [];

        const uniqueValues = new Set();

        // This loop fills in the header (unique keys) for the new_data array
        for (let i = 0; i < thirdRow.length; i++) {
            const keys = Object.keys(thirdRow[i] || {});
            keys.forEach(key => {
                if (!uniqueValues.has(key)) {
                    uniqueValues.add(key);
                    new_data_array.push(key);
                }
            });
        }
        new_data.push(new_data_array); // Push header row
        new_data_array = [];

        // This loop fills in the first column, which is months
        for (let i = 0; i < data[2].length; i++) {
            currentMonth = data[1][i];
            if (preMonth === '') {
                preMonth = currentMonth;
            } else if (preMonth !== currentMonth && preMonth !== '') {
                new_data_array.push(preMonth);
                preMonth = currentMonth;
                new_data.push(new_data_array);
                new_data_array = [];
            } else if (i === data[2].length - 1) {
                new_data_array.push(preMonth);
                new_data.push(new_data_array);
                new_data_array = [];
            }
        }

        // This loop fills in the values in the new_data array
        for (let i = 0; i < thirdRow.length; i++) {
            const key = Object.keys(thirdRow[i] || {})[0]; // Get the key
            const values = Object.values(thirdRow[i] || {})[0]; // Get the value
            for (let k = 0; k < new_data.length; k++) {
                if (new_data[k][0] === data[1][i]) { // Match month
                    for (let j = 0; j < new_data[0].length; j++) {
                        if (new_data[0][j] === key) { // Match key
                            new_data[k][j] = values; // Fill in the value
                        }
                    }
                }
            }
        }

        // This loop check every cell has value
        for (let i=0; i<new_data.length; i++) {
            for (let j=0;j<new_data[0].length;j++) {
                if(new_data[i][j] === undefined) {
                    new_data[i][j] = 0;
                }
            }
        }

        return new_data;
    }

    makeArrayWithoutOS_selectedStudent (data, selectedStudent) {
        let new_data = [];
        let new_data_array = ['month'];
        let currentMonth;
        let preMonth = '';

        const uniqueValues = new Set();

        // This loop fills in the header (unique) for the new_data array
        for (let i = 2; i < data[1].length; i++) {
            if (!uniqueValues.has(data[1][i]) && data[1][i] !== 'OS') {
                uniqueValues.add(data[1][i]);
                new_data_array.push(data[1][i]);
            }
        }
        new_data.push(new_data_array); // Push header row
        new_data_array = [];

        // This loop fills in the first column, which is months
        for (let i = 0; i < data[2].length; i++) {
            currentMonth = data[0][i];
            if (preMonth === '') {
                preMonth = currentMonth;
            } else if (preMonth !== currentMonth && preMonth !== '') {
                new_data_array.push(preMonth);
                preMonth = currentMonth;
                new_data.push(new_data_array);
                new_data_array = [];
            } else if (i === data[2].length - 1) {
                new_data_array.push(preMonth);
                new_data.push(new_data_array);
                new_data_array = [];
            }
        }

        // This loop fills in the values in the new_data array
        for(let a=0; a<data.length;a++) {//check student in which row
            if(data[a][1].toUpperCase().trim() === selectedStudent) {
                for (let i = 0; i < data[0].length; i++) {
                    const key = data[1][i]; // Get the key
                    const values = data[a][i]; // Get the value
                    for (let k = 0; k < new_data.length; k++) {
                        if (new_data[k][0] === data[0][i]) { // Match month
                            for (let j = 0; j < new_data[0].length; j++) {
                                if (new_data[0][j] === key) { // Match key
                                    new_data[k][j] = values; // Fill in the value
                                }
                            }
                        }
                    }
                }
            }
        }

        return new_data;
    }

    removeColumn_OS(data) { 
        // Find the index of the column to remove
        const columnIndex = data[0].indexOf('OS');
        
        if (columnIndex === -1) {
            console.error('Column OS not found.');
            return data;
        }

        // Remove the column from each row
        for (let i = 0; i < data.length; i++) {
            data[i].splice(columnIndex, 1);
        }

        return data;
    }

    makeArrayNoObject2(data) { //month in the first column
            let new_data = [];
            let new_data_array = ['month'];
        
            const uniqueValues = new Set();
        
            // This loop fills in the header (unique keys) for the new_data array
            for (let i = 0; i < data.length; i++) {
                for(let j=1; j<data[data.length-1].length; j++) {
                    const keys = Object.keys(data[i][j] || {});
                    keys.forEach(key => {
                        if (!uniqueValues.has(key)) {
                            uniqueValues.add(key);
                            new_data_array.push(key);
                        }
                    });
                }
            }
            new_data.push(new_data_array); // Push header row
            new_data_array = [];
        
            // This loop fills in the first column, which is months
            for(let i=0; i<data.length; i++) {
                new_data_array.push(data[i][0]);
                new_data.push(new_data_array); // Push header row
                new_data_array = [];
            }
        
            // This loop fills in the values in the new_data array
            for (let i = 0; i < data.length; i++) {
                for(let j=1; j<data[data.length-1].length; j++) {
                    const key = Object.keys(data[i][j] || {})[0]; // Get the key
                    const values = Object.values(data[i][j] || {})[0]; // Get the value
                    for (let k = 0; k < new_data.length; k++) {
                        if (new_data[k][0] === data[i][0]) { // Match month
                            for (let j = 0; j < new_data[0].length; j++) {
                                if (new_data[0][j] === key) { // Match key
                                    new_data[k][j] = values; // Fill in the value
                                }
                            }
                        }
                    }
                }  
            }
            return new_data;
    }
}

export { DATACLEANING };
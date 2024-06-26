class File {
    //constructor

    //method
    //CSV data
    // Function to load CSV data
    loadCSV(file, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                } else {
                    console.error('Failed to load CSV file');
                }
            }
        };
        xhr.open('GET', file, true);
        xhr.send();
    }

    // Function to parse CSV data
    parseCSV(csvData, options = {}) {
        // Adjust line break replacement based on open double quotes
        const quoteAdjustedData = csvData.replace(/"([^"]*?)"/gs, (match, p1) => {
            // Replace line breaks and \r inside double quotes with spaces
            return p1.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ');
        });
        
        let rows = quoteAdjustedData.split('\n').map(row => row.split(','));
    
        // Remove empty arrays
        rows = rows.filter(row => row.some(cell => cell.trim() !== ''));
    
        // Remove rows where only one value exists and the rest are empty
        rows = rows.filter(row => row.filter(cell => cell.trim() !== '').length > 1);
        
        if (options.ignoreFirstRow) {
            rows = rows.slice(1);
        }
    
        if (options.ignoreFirstColumn) {
            rows = rows.map(row => row.slice(1));
        }
    
        if (options.ignoreLastRow) {
            rows.pop();
        }
    
        // Remove spaces from each cell
        rows = rows.map(row => row.map(cell => cell.trim()));
    
        // Filter out rows where all cells are empty
        rows = rows.filter(row => row.some(cell => cell !== ''));
    
        // Replace empty cells with previous non-empty value in the same row, excluding numbers
        for (let i = 0; i < rows.length; i++) {
            let previousValue = '';
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j] === '') {
                    if (!isNaN(parseFloat(previousValue))) {
                        if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(previousValue)) {
                            previousValue = ''; // Reset previous value if it's a number
                        }
                    }
                    rows[i][j] = previousValue;
                } else {
                    previousValue = rows[i][j];
                }
            }
        }
    
        // Replace empty cells with previous non-empty value in the same column, excluding numbers
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j] === '' && i > 0 && isNaN(parseFloat(rows[i - 1][j]))) {
                    rows[i][j] = rows[i - 1][j];
                }
            }
        }
    
        // // Define a regular expression to match dates with time
        // const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

        // // Modify the isDateRow function to use the new date format
        // const isDateRow = row => row.some(cell => dateRegex.test(cell));

        // // Find all date column indices in the first row
        // const dateColumnIndices = [];
        // if (isDateRow(rows[0])) {
        //     rows[0].forEach((cell, index) => {
        //         if (dateRegex.test(cell)) {
        //             dateColumnIndices.push(index);
        //         }
        //     });
        // }

        // // Remove entire columns containing dates from all rows
        // if (dateColumnIndices.length > 0) {
        //     rows = rows.map(row => row.filter((_, index) => !dateColumnIndices.includes(index)));
        // }

        // Define a regular expression to match dates with time
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

        // Modify the isDateRow function to use the new date format and ignore first 5 columns
        const isDateRow = row => row.slice(9).some(cell => dateRegex.test(cell));

        // Find all date column indices in the first row, ignoring the first 9 columns
        const dateColumnIndices = [];
        if (isDateRow(rows[0])) {
            rows[0].forEach((cell, index) => {
                if (index >= 9 && dateRegex.test(cell)) {
                    dateColumnIndices.push(index);
                }
            });
        }

        // Remove entire columns containing dates from all rows, ignoring the first 9 columns
        if (dateColumnIndices.length > 0) {
            rows = rows.map(row => row.filter((_, index) => index < 9 || !dateColumnIndices.includes(index)));
        }
    
        // Remove "December" columns
        // Find the index of the first December column
        let decemberColumnIndex = -1;
        for (let i = 0; i < rows[0].length; i++) {
            if (rows[0][i].toLowerCase() === 'december') {
                decemberColumnIndex = i;
                break;
            }
        }
    
        // Remove columns after the first December column
        if (decemberColumnIndex !== -1) {
            rows = rows.map(row => row.slice(0, decemberColumnIndex));
        }
    
        // Remove redundant "November" columns
        // Find the index of the second occurrence of November and "OS"
        let novemberColumnIndex = -1;
        let osCount = 0;
        let osColumnIndex = -1;
    
        for (let i = 0; i < rows[0].length; i++) {
            const cell = rows[0][i].toLowerCase();
            const cell2 = rows[1][i].toLowerCase();
            if (cell === 'november') {
                if (cell2 === 'os') {
                    osCount++;
                }
                if (cell === 'november' && osCount === 1 && osColumnIndex === -1) {
                    novemberColumnIndex = i;
                } else if (osCount === 2) {
                    osColumnIndex = i;
                    break;
                }
            }
        }
    
        // Remove columns starting from the second occurrence of November until the end of the row
        if (novemberColumnIndex !== -1 && osColumnIndex !== -1) {
            // The second occurrence of both "November" and "OS" is found
            rows = rows.map(row => row.slice(0, novemberColumnIndex + 1));
        } else if (novemberColumnIndex !== -1 && osCount < 2) {
            // Only one occurrence of "OS" is found or none after the second occurrence of "November"
            rows = rows.map(row => row.slice(0, novemberColumnIndex + 1));
        }
        
        // Remove rows without a number at the first column if removeRowsWithoutNumber option is true
        if (options.removeRowsWithoutNumber) {
            rows = rows.filter((row, index) => index < 2 || !isNaN(parseFloat(row[0])));
        }
    
        if (options.checkAndReplaceSchoolDays) {
            rows = this.checkAndReplaceSchoolDays(rows);
        }
        
        if (options.calculateColumn14) {
            rows = this.calculateColumn14(rows);
        }
    
        if (options.checkAndReplaceAccurateClassName) {
            rows = this.checkAndReplaceAccurateClassName(rows);
        }
    
        // Remove columns that are entirely empty
        const nonEmptyColumnIndices = rows[0].map((_, colIndex) => colIndex)
            .filter(colIndex => rows.some(row => row[colIndex] && row[colIndex].trim() !== ''));
    
        rows = rows.map(row => nonEmptyColumnIndices.map(colIndex => row[colIndex]));


        // Remove rows where the first cell is empty starting from the third row
        rows = rows.slice(0, 2).concat(rows.slice(2).filter((row, index) => index < 2 || row[0].trim() !== ''));


        return rows;
    }
    

    // New method to check and replace maximum school days for the same class
    checkAndReplaceSchoolDays(rows) {
        const classIndex = 3; // Assuming the class information is in the first column
        const schoolDaysIndex = 13; // Assuming the school days information is in the second column
        const classMap = new Map(); // Map to store class and its maximum school days

        rows.forEach(row => {
            const className = row[classIndex];
            const schoolDays = parseInt(row[schoolDaysIndex]);

            if (!classMap.has(className) || schoolDays > classMap.get(className)) {
                classMap.set(className, schoolDays);
            }
        });

        rows.forEach(row => {
            const className = row[classIndex];
            const maxSchoolDays = classMap.get(className);

            if (parseInt(row[schoolDaysIndex]) < maxSchoolDays) {
                row[schoolDaysIndex] = maxSchoolDays.toString();
            }
        });

        return rows;
    }

    // New method to calculate column 14 based on column 10 and column 13
    calculateColumn14(rows) {
        const column10Index = 10;
        const column13Index = 13;
        const column14Index = 14;

        // Start iterating from the second row (index 1) to skip the header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const column10Value = parseFloat(row[column10Index]);
            const column13Value = parseFloat(row[column13Index]);

            if (!isNaN(column10Value) && !isNaN(column13Value) && column13Value !== 0) {
                const column14Value = (column10Value / column13Value) * 100;
                row[column14Index] = column14Value.toFixed(2);
            } else {
                row[column14Index] = ''; // Set empty if values are not valid for calculation
            }
        }

        return rows;
    }

    // New method to do data cleaning with the attendance datasets
    checkAndReplaceAccurateClassName(rows) {
        const classIndex = 4;

        for(let i=0; i<rows.length; i++) {
            const row = rows[i];
            const currentClass = row[classIndex];
            if(currentClass === 'Happy Cubs' || currentClass === 'C1: HAPPY CUBS (HL AM)') {
                row[classIndex] = 'C1: HAPPY CUBS';
            }
            else if(currentClass === 'Kind Cubs' || currentClass === 'C1:KIND CUBS (PM)') {
                row[classIndex] = 'C1:KIND CUBS';
            }
            else if(currentClass === 'Strong Cubs') {
                row[classIndex] = 'C1:STRONG CUBS';
            }
        }

        return rows;
    }

}

// Export the File class
export { File };

import { File } from '../dataCleaning/file.js';

// object
const object_file = new File();

class DATA_LOADFILE {
    // constructor
    constructor() {
        this.objectData = [];
        this.parsedData;
    }

    // methods
    loadNparseCSV(file, year, callback) {
        let dataStore = [];
        if(Number(year) === 2022) {
            object_file.loadCSV(file, (csvData) => {
                const data = object_file.parseCSV(csvData);
                this.parsedData = data;
                
                // Extract header row
                const headers = data[2].slice(2); // Extract headers from the third row starting from the third column
                
                const monthRow = data[0].slice(2).map(month => month.split(' ')[0].toUpperCase()); // First row containing the month data, accessing the third element
                // Data Cleaning: change the last occurence "OCTOBER" to "NOVEMBER"
                const lastIndexOct = monthRow.lastIndexOf("OCTOBER");
                if (lastIndexOct !== -1) {
                    monthRow[lastIndexOct] = "NOVEMBER";
                }
                dataStore = data.slice(3).map(row => ({
                    class: row[0].toUpperCase().trim(),
                    name: row[1].toUpperCase().trim(),
                    scores: headers.map((header, index) => {
                        const score = row[index + 2];
                        return {
                            [header]: score === '#DIV/0!' ? 0 : Number(score)
                        };
                    }), // Map scores to their respective headers
                    month: monthRow,
                    year: '2022'
                }));
    
                this.objectData.length = 0;
                this.objectData.push(...dataStore);
    
                // console.log(this.objectData);
                // Call the callback function after data loading is complete
                callback();
            });
        }
        else if (Number(year) === 2023) {
            object_file.loadCSV(file, (csvData) => {
                const data = object_file.parseCSV(csvData);
                this.parsedData = data;
                
                // Extract header row
                const headers = data[1].slice(8);
    
                dataStore = data.slice(2).map(row => ({
                    class: row[1].toUpperCase().trim(),
                    name: row[2].toUpperCase().trim(),
                    year: '2023',
                    month: data[0].slice(8).map(month => month.toUpperCase()),
                    scores: headers.map((header, index) => {
                        const score = row[index + 8];
                        return {
                            [header]: score === '#DIV/0!' ? 0 : Number(score)
                        };
                    }) // Map scores to their respective headers
                }));
    
                this.objectData.length = 0;
                this.objectData.push(...dataStore);
    
                // console.log(this.objectData);
                // Call the callback function after data loading is complete
                callback();
            });
        }
        else {
            object_file.loadCSV(file, (csvData) => {
                const data = object_file.parseCSV(csvData);
                this.parsedData = data;
                
                // Extract header row
                const headers = data[1].slice(9);
    
                dataStore = data.slice(2).map(row => ({
                    teacher: row[1].toUpperCase().trim(),
                    class: row[2].toUpperCase().trim(),
                    name: row[3].toUpperCase().trim(),
                    year: year,
                    month: data[0].slice(9).map(month => month.toUpperCase()),
                    scores: headers.map((header, index) => {
                        const score = row[index + 9];
                        return {
                            [header]: score === '#DIV/0!' ? 0 : Number(score)
                        };
                    }) // Map scores to their respective headers
                }));
    
                this.objectData.length = 0;
                this.objectData.push(...dataStore);
    
                // console.log(this.objectData);
                // Call the callback function after data loading is complete
                callback();
            });
        }
    }

    loadNparseCSV_async(file, year) {
        return new Promise((resolve, reject) => {
            let dataStore = [];
            object_file.loadCSV(file, (csvData) => {
                try {
                    const data = object_file.parseCSV(csvData);
                    this.parsedData = data;
                    
                    let headers, monthRow;

                    if (Number(year) === 2022) {
                        headers = data[2].slice(2);
                        monthRow = data[0].slice(2).map(month => month.split(' ')[0].toUpperCase());
                        const lastIndexOct = monthRow.lastIndexOf("OCTOBER");
                        if (lastIndexOct !== -1) {
                            monthRow[lastIndexOct] = "NOVEMBER";
                        }
                        dataStore = data.slice(3).map(row => ({
                            class: row[0].toUpperCase().trim(),
                            name: row[1].toUpperCase().trim(),
                            scores: headers.map((header, index) => ({
                                [header]: row[index + 2] === '#DIV/0!' ? 0 : Number(row[index + 2])
                            })),
                            month: monthRow,
                            year: '2022'
                        }));
                    } else if (Number(year) === 2023) {
                        headers = data[1].slice(8);
                        dataStore = data.slice(2).map(row => ({
                            class: row[1].toUpperCase().trim(),
                            name: row[2].toUpperCase().trim(),
                            year: '2023',
                            month: data[0].slice(8).map(month => month.toUpperCase()),
                            scores: headers.map((header, index) => ({
                                [header]: row[index + 8] === '#DIV/0!' ? 0 : Number(row[index + 8])
                            }))
                        }));
                    } else {
                        headers = data[1].slice(9);
                        dataStore = data.slice(2).map(row => ({
                            teacher: row[1].toUpperCase().trim(),
                            class: row[2].toUpperCase().trim(),
                            name: row[3].toUpperCase().trim(),
                            year: year,
                            month: data[0].slice(9).map(month => month.toUpperCase()),
                            scores: headers.map((header, index) => ({
                                [header]: row[index + 9] === '#DIV/0!' ? 0 : Number(row[index + 9])
                            }))
                        }));
                    }
                    
                    this.objectData.length = 0;
                    this.objectData.push(...dataStore);
                    resolve();
                } catch (error) {
                    // reject(error);
                }
            });
        });
    }
}

export { DATA_LOADFILE };
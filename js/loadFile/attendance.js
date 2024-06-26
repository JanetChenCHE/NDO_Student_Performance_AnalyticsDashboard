import { File } from '../dataCleaning/file.js';
import { DropDownMenu } from '../forHTML/dropDownMenu.js';

// object
const object_file = new File();

class ATTENDANCE_LOADFILE {
    // constructor
    constructor() {
        this.objectData = [];
        this.objectData_year_month;
        this.parsedData;
    }

    // methods
    loadNparseCSV(file, callback) {
        object_file.loadCSV(file, (csvData) => {
            // 1
            const data = object_file.parseCSV(csvData);
            this.objectData_year_month = this.dataCleaning(data);

            // 2
            this.parsedData = object_file.parseCSV(csvData, {
                checkAndReplaceSchoolDays: true,
                calculateColumn14: true,
                checkAndReplaceAccurateClassName: true
            });
    
            // Call the callback function after data loading is complete
            callback();
        });
    }

    loadNparseCSV_async(file) {
        
        return new Promise((resolve, reject) => {
            object_file.loadCSV(file, (csvData) => {
                // 1
                const data = object_file.parseCSV(csvData);
                this.objectData_year_month = this.dataCleaning(data);
    
                // 2
                this.parsedData = object_file.parseCSV(csvData, {
                    checkAndReplaceSchoolDays: true,
                    calculateColumn14: true,
                    checkAndReplaceAccurateClassName: true
                });
                
                resolve();
            });
        });
    }
    
    loadNparseCSV_objectFile(file, callback) {
        let dataStore = [];
        object_file.loadCSV(file, (csvData) => {
            // 1
            const data = object_file.parseCSV(csvData);
            this.objectData_year_month = this.dataCleaning(data);

            // 2
            const parsedData = object_file.parseCSV(csvData, {
                checkAndReplaceSchoolDays: true,
                calculateColumn14: true,
                checkAndReplaceAccurateClassName: true
            });

            // Extract the headers from the second row
            const headers = parsedData[1].map(header => header.toUpperCase().trim());
    
            // Define static headers mapping
            const staticHeaders = {
                'NAME': 'name',
                'CLASS': 'class',
                'GENDER': 'gender',
                'BIRTHDATE': 'dob',
                'PRESENT DAYS': 'presence',
                'ABSENT DAYS': 'absent',
                'RATE': 'rate'
            };
    
            // Map headers to their indices
            const headerIndices = {};
            headers.forEach((header, index) => {
                headerIndices[header] = index;
            });
    
            // Skip the first three rows (headers and any additional info) and map the data
            dataStore = parsedData.slice(2).map(row => {
                const mappedRow = {};
    
                // Map static headers
                Object.keys(staticHeaders).forEach(header => {
                    if (header in headerIndices) {
                        const key = staticHeaders[header];
                        mappedRow[key] = row[headerIndices[header]].toUpperCase().trim();
                    }
                });
    
                // Map date headers
                headers.forEach((header, index) => {
                    // Check if header matches the date format
                    if (header.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        const dateValue = row[index].toUpperCase().trim();
                        mappedRow[header] = dateValue;
                    }
                });
    
                return mappedRow;
            });
    
            // Clear and update the objectData array
            this.objectData.length = 0;
            this.objectData.push(...dataStore);
    
            // Call the callback function after data loading is complete
            callback();
        });
    }
    
    dataCleaning(data) {
        // Initialize array to store calculated values
        const newDataArray = [];
    
        // Initialize variables to store previous month and year
        let prevMonth = '';
        let prevYear = '';
    
        // Initialize variables to store counts
        let schoolDays = 0;
        let presentCount = 0;
        let name;
        let className;
        let gender;
        let noAttendance = true; // Flag to check if all values are "No Attendance"
    
        // Iterate through each value in the column, starting from the second row
        for (let i = 1; i < data.length; i++) {
            // Iterate through each column starting from the 18th column (assuming data[0][17])
            for (let j = 17; j < data[0].length; j++) {
                // Extract year and month from the date column
                const [year, month] = data[0][j].split('-'); // Assuming the date format is yyyy-mm-dd
    
                // Check if it's the first iteration
                if (prevMonth === '' && prevYear === '') {
                    prevMonth = month;
                    prevYear = year;
                }
    
                // Check if month and year are the same as the previous iteration
                const sameMonthYear = prevMonth === month && prevYear === year;
    
                // Reset schoolDays & presentCount if month and year change or at the last column
                if (!sameMonthYear || j === data[0].length - 1) {
                    // Calculate the presence rate only if there was attendance data
                    if (!noAttendance) {
                        const presenceRate = schoolDays === 0 ? 0 : (presentCount / schoolDays) * 100;
                        const presenceRateFormatted = presenceRate.toFixed(2);
    
                        // Construct new object with calculated values
                        const newDataObject = {
                            year: prevYear, // Using prevYear since we update prevYear later
                            month: prevMonth, // Using prevMonth since we update prevMonth later
                            name: name, // Assuming the name is in the 2nd column (index 1)
                            class: className, // Assuming the class is in the 4th column (index 3)
                            gender: gender, // Assuming the gender is in the 10th column (index 9)
                            schoolDays: schoolDays,
                            presentCount: presentCount,
                            presenceRate: Number(presenceRateFormatted) // Updated to use the formatted presence rate
                        };
    
                        // Push the new object to the newDataArray
                        newDataArray.push(newDataObject);
                    }
    
                    // Reset the counts for the next month
                    schoolDays = 0;
                    presentCount = 0;
                    noAttendance = true; // Reset no attendance flag
    
                    // Update previous month and year
                    prevMonth = month;
                    prevYear = year;
                }
    
                // Check if the value is 'PRESENT' (case insensitive)
                if (data[i][j].toUpperCase() === 'PRESENT') {
                    if (sameMonthYear) {
                        presentCount++;
                        schoolDays++; // Increment school days for each 'PRESENT' value
                        noAttendance = false; // Mark as there is attendance data
                    }
                } else if (data[i][j].toUpperCase() === 'ABSENT') {
                    if (sameMonthYear) {
                        schoolDays++; // Increment school days for each 'ABSENT' value
                        noAttendance = false; // Mark as there is attendance data
                    }
                }
                name = data[i][2];
                gender = data[i][10];
    
                // Also do the data cleaning
                const currentClass = data[i][4];
                if (currentClass === 'Happy Cubs' || currentClass === 'C1: HAPPY CUBS (HL AM)') {
                    className = 'C1: HAPPY CUBS';
                } else if (currentClass === 'Kind Cubs' || currentClass === 'C1:KIND CUBS (PM)') {
                    className = 'C1:KIND CUBS';
                } else if (currentClass === 'Strong Cubs') {
                    className = 'C1:STRONG CUBS';
                } else {
                    className = data[i][4];
                }
            }
        }
        return newDataArray;
    }
    
    populateDropDownMenu(file1, file2) {
        this.loadNparseCSV(file1, () => {
            const data_file1 = this.objectData_year_month;
            this.loadNparseCSV(file2, () => {
                const data_file2 = this.objectData_year_month;
                // Populate class select element
                const combinedData = [...(data_file1 || []), ...(data_file2 || [])];
                const object_dropDownMenu1 = new DropDownMenu();
                object_dropDownMenu1.populateSelection('classSelect_att', combinedData, 'class');
            });
        });

    }
    
}

export { ATTENDANCE_LOADFILE };
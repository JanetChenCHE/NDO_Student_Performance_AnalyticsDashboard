
import { File } from '../dataCleaning/file.js';
import { DropDownMenu } from '../forHTML/dropDownMenu.js';

// object
const object_file = new File();
const object_dropDownMenu = new DropDownMenu();

class DATABASE_LOADFILE {
    constructor() {
        this.objectData = [];
        this.columnIndices = {};
    }

    loadNparseCSV(file, callback) {
        let dataStore = [];
        object_file.loadCSV(file, (csvData) => {
            const data = object_file.parseCSV(csvData);
            
            // Extract header row
            const headerRow = data[0];
            
            // Map column names to their respective indices
            headerRow.forEach((header, index) => {
                const columnName = header.toLowerCase().replace(/\s/g, ''); // Remove spaces and convert to lowercase
                this.columnIndices[columnName] = index;
            });

            dataStore = data.slice(1).map(row => {
                const rowData = {};
                for (const columnName in this.columnIndices) {
                    const columnIndex = this.columnIndices[columnName];
                    rowData[columnName] = columnIndex !== -1 ? row[columnIndex].toUpperCase().trim() : '';
                }
                return rowData;
            });

            this.objectData.length = 0;
            this.objectData.push(...dataStore);

            // Call the callback function after data loading is complete
            callback();
        });
    }

    loadNparseCSV_async(file) {
        return new Promise((resolve, reject) => {
            let dataStore = [];
            object_file.loadCSV(file, (csvData) => {
                const data = object_file.parseCSV(csvData);
                
                // Extract header row
                const headerRow = data[0];
                
                // Map column names to their respective indices
                headerRow.forEach((header, index) => {
                    const columnName = header.toLowerCase().replace(/\s/g, ''); // Remove spaces and convert to lowercase
                    this.columnIndices[columnName] = index;
                });
    
                dataStore = data.slice(1).map(row => {
                    const rowData = {};
                    for (const columnName in this.columnIndices) {
                        const columnIndex = this.columnIndices[columnName];
                        rowData[columnName] = columnIndex !== -1 ? row[columnIndex].toUpperCase().trim() : '';
                    }
                    return rowData;
                });
    
                this.objectData.length = 0;
                this.objectData.push(...dataStore);
                resolve();
            });
        });
    }

    async populate(file) {
        // Arrow function to retain the outer 'this' context
        await this.loadNparseCSV_async(file);
        // Populate select elements using this.objectData
        object_dropDownMenu.populateSelection('studentSelect', this.objectData, 'nameofchild');
        object_dropDownMenu.populateSelection('classSelect', this.objectData, 'class');
        object_dropDownMenu.populateSelection('cohortSelect', this.objectData, 'cohort');
        object_dropDownMenu.populateSelection('cohortSelect_teacher', this.objectData, 'cohort');
    }
}



export { DATABASE_LOADFILE };

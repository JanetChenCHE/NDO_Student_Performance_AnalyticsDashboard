
import { DropDownMenu } from './js/forHTML/dropDownMenu.js';
import { ATTENDANCE_LOADFILE } from './js/loadFile/attendance.js';
import { LINECHART_ATT_GENDER } from './js/d3/lineChart_att_gender.js';
import { LINECHART_ATT } from './js/d3/lineChart_att.js';

//object 
const object_linechart_att_gender = new LINECHART_ATT_GENDER();
const object_linechart_att = new LINECHART_ATT();

const first = {cohort: 1, year: 2022};
const currentYear = new Date().getFullYear();
const difference = currentYear - first.year;
const cohort_current = first.cohort + difference;


const loadAndParseCSV = (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const obj = new ATTENDANCE_LOADFILE();
            obj.loadNparseCSV(fileName, () => {
                resolve(obj.objectData_year_month);
            });
        } catch (error) {
            reject(`Error loading or parsing CSV file ${fileName}: ${error}`);
        }
    });
};

// If the attendance record file is store as every year, this code is functionable
// ELSE, dont use this code
let a;
let allFileName_att = [];
let yearFile = currentYear;
for(let i = 0; i <5; i++) {
    if(yearFile >=2022) {
        const fileName = `./datasets_csv/Nicol_David_Organisation_${yearFile}.csv`;
        allFileName_att.push(fileName);
        yearFile--;
    }
}
// console.log(allFileName_att);
// const allFileName_att = ['./datasets_csv/Nicol_David_Organisation_1.csv', './datasets_csv/Nicol_David_Organisation_2.csv'];

let combinedData = [];
const loadAllFiles = async () => {
    for (const fileName of allFileName_att) {
        try {
            const data = await loadAndParseCSV(fileName);
            combinedData.push(...(data || []));
        } catch (error) {
            console.error(error);
        }
    }
    // Remove exact duplicate rows from combinedData
    const seen = new Set();
    const uniqueData = [];

    for (const row of combinedData) {
        const rowValues = Object.values(row); // Convert the row object to an array of its values
        const rowKey = rowValues.join('|'); // Use a delimiter that is not likely to be in the data
        // console.log(rowKey);
        if (!seen.has(rowKey)) {
            seen.add(rowKey);
            uniqueData.push(row);
        }
    }

    combinedData = uniqueData;
};

// Populate the dropdown Menu in "html"
// Call the async function and populate the class in attendance dashboard
loadAllFiles().then(() => {
    const object_dropDownMenu = new DropDownMenu();
    object_dropDownMenu.populateSelection('classSelect_att', combinedData, 'class');
    // console.log(combinedData);
});


// Generate Chart
function generateChart(selectedYear, selectedCohort, selectedClass, switch_showLable){
    loadAllFiles().then(() => {
        processDataAndGenerateReports_NDO(combinedData, selectedYear, switch_showLable);
        processDataAndGenerateReports_class(combinedData, selectedYear, selectedCohort, selectedClass, switch_showLable);
    });
}

export function generateChart_StudentPerformacneDashboard(selectedYear, selectedStudent, switch_showLable) {
    loadAllFiles().then(() => {
        processDataAndGenerateReports_SPECIFICstudent(combinedData, selectedYear, selectedStudent, switch_showLable);
    });
}

export function generateChart_TeacherPerformacneDashboard(selectedYear, selectedteacher, studentName_array, switch_showLable){
    // console.log(switch_showLable);
    loadAllFiles().then(() => {
        processDataAndGenerateReports_student(combinedData, selectedYear, selectedteacher, studentName_array, switch_showLable);
    });
}

function processDataAndGenerateReports_NDO(data, selectedYear, switch_showLable) {
    // Data cleaning
    const newDataArray = data;

    // MONTHLY REPORT
    // Define a new array to store the monthly averages
    const monthlyAverages = [];

    // Define the months
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    // Iterate through each month
    months.forEach(month => {
        // Define variables to store counts and sums for each gender for the current month
        let count = 0;
        let sum = 0;

        // Iterate through newDataArray to calculate counts and sums for the current month and gender
        newDataArray.forEach(row => {
            if (row.year === selectedYear && row.month === month && row.schoolDays !== 0) {
                count++;
                sum += parseFloat(row.presenceRate);
            }
        });

        // Calculate average presence rate for males and females
        const average = count > 0 ? sum / count : 0;

        // Push the monthly averages to the new array
        monthlyAverages.push([month, 'MALE', Number(average.toFixed(2))]);
    });

    // make chart
    object_linechart_att.loadLineChart(monthlyAverages, '#line_chart_att_NDO', switch_showLable);

}

function processDataAndGenerateReports_class(data, selectedYear, selectedCohort, selectedClass, switch_showLable) {
    // Data cleaning
    const newDataArray = data;

    //MONTHLY
    // Define a new array to store the monthly averages by class
    const monthlyAveragesByClass = [];

    // Get unique class names
    const uniqueCohort = [...new Set(newDataArray.map(item => ((item.class).match(/\d+/)) ? ((item.class).match(/\d+/))[0]: null))];
    const uniqueClassName = [...new Set(newDataArray.map(item => ((item.class).match(/:\s*(.*)/)) ? ((item.class).match(/:\s*(.*)/))[1]: null))];
    const uniqueClasses = [...new Set(newDataArray.map(item => item.class))];

    // Iterate through each unique class
    if(selectedCohort && !selectedClass) {
        // Iterate through each unique class
        uniqueCohort.forEach(cohort => {
            // Define an object to store counts and sums for each month for the current class
            const classData = {};

            // Initialize counts and sums to 0 for each month
            for (let month = 1; month <= 12; month++) {
                classData[month] = { schoolDays: 0, presentCount: 0 };
            }

            // Iterate through newDataArray to calculate counts and sums for each month for the current class
            newDataArray.forEach(row => {
                const rowClass_number = (row.class).match(/\d+/);
                const rowClass_cohort = rowClass_number ? rowClass_number[0]: null;
                if (row.year === selectedYear && rowClass_cohort === cohort) {
                    classData[parseInt(row.month)].schoolDays += row.schoolDays;
                    classData[parseInt(row.month)].presentCount += row.presentCount;
                }
            });

            // Calculate average presence rate for each month for the current class
            for (let month = 1; month <= 12; month++) {
                const presenceRate = classData[month].schoolDays === 0 ? 0 : (classData[month].presentCount / classData[month].schoolDays) * 100;
                monthlyAveragesByClass.push({
                    month: month.toString(),
                    class: cohort,
                    presenceRate: Number(presenceRate.toFixed(2))
                });
            }
        });
    } 
    else if(!selectedCohort && selectedClass) {
        // Iterate through each unique class
        uniqueClassName.forEach(className => {
            // Define an object to store counts and sums for each month for the current class
            const classData = {};

            // Initialize counts and sums to 0 for each month
            for (let month = 1; month <= 12; month++) {
                classData[month] = { schoolDays: 0, presentCount: 0 };
            }

            // Iterate through newDataArray to calculate counts and sums for each month for the current class
            newDataArray.forEach(row => {
                const textMatch = (row.class).match(/:\s*(.*)/);
                const className_get = textMatch ? textMatch[1] : null;
                if (row.year === selectedYear && className_get === className) {
                    classData[parseInt(row.month)].schoolDays += row.schoolDays;
                    classData[parseInt(row.month)].presentCount += row.presentCount;
                }
            });

            // Calculate average presence rate for each month for the current class
            for (let month = 1; month <= 12; month++) {
                const presenceRate = classData[month].schoolDays === 0 ? 0 : (classData[month].presentCount / classData[month].schoolDays) * 100;
                monthlyAveragesByClass.push({
                    month: month.toString(),
                    class: className,
                    presenceRate: Number(presenceRate.toFixed(2))
                });
            }
        });
    } 
    else if(selectedCohort && selectedClass) {
        // Iterate through each unique class
        uniqueClasses.forEach(className => {
            // Define an object to store counts and sums for each month for the current class
            const classData = {};

            // Initialize counts and sums to 0 for each month
            for (let month = 1; month <= 12; month++) {
                classData[month] = { schoolDays: 0, presentCount: 0 };
            }

            // Iterate through newDataArray to calculate counts and sums for each month for the current class
            newDataArray.forEach(row => {
                if (row.year === selectedYear && row.class === className) {
                    classData[parseInt(row.month)].schoolDays += row.schoolDays;
                    classData[parseInt(row.month)].presentCount += row.presentCount;
                }
            });

            // Calculate average presence rate for each month for the current class
            for (let month = 1; month <= 12; month++) {
                const presenceRate = classData[month].schoolDays === 0 ? 0 : (classData[month].presentCount / classData[month].schoolDays) * 100;
                monthlyAveragesByClass.push({
                    month: month.toString(),
                    class: className,
                    presenceRate: Number(presenceRate.toFixed(2))
                });
            }
        });
    }

    let selectedClassAverages = [];
    for(let i = 0; i < monthlyAveragesByClass.length; i++) {
        const classCohort = monthlyAveragesByClass[i].class;
        
        const numberMatch = classCohort.match(/\d+/);
        const cohortNum = numberMatch ? numberMatch[0] : null;
        
        const textMatch = classCohort.match(/:\s*(.*)/);
        const className = textMatch ? textMatch[1] : null;
        if(selectedCohort && !selectedClass) {
            if (classCohort.trim() === selectedCohort.trim()) {
                selectedClassAverages.push(monthlyAveragesByClass[i]);
            }
        } 
        else if(!selectedCohort && selectedClass) {
            if (classCohort.toUpperCase().trim() === selectedClass.toUpperCase().trim()) {
                selectedClassAverages.push(monthlyAveragesByClass[i]);
            }
        } 
        else if(selectedCohort && selectedClass) {
            if (className && className.toUpperCase().trim() === selectedClass.toUpperCase().trim() && cohortNum && cohortNum.trim() === selectedCohort.trim()) {
                selectedClassAverages.push(monthlyAveragesByClass[i]);
            }
        }
        
    }

    // Initialize 2D array to store the result
    const resultArray = [];

    // Iterate through selectedClassAverages and push values into resultArray
    selectedClassAverages.forEach(item => {
        resultArray.push([item.month, item.class, item.presenceRate]);
    });

    // Output the filtered data
    object_linechart_att.loadLineChart(resultArray, '#line_chart_att_class', switch_showLable);
}

function processDataAndGenerateReports_student(data, selectedYear, selectedteacher, array_student, switch_showLable) {
    // Data cleaning
    const newDataArray = data;

    //MONTHLY
    // Define a new array to store the monthly averages by student
    const monthlyAveragesByStudent = [];

    // Get unique student names
    const uniqueNames = [...new Set(newDataArray.map(item => item.name))];

    // Iterate through each unique name
    uniqueNames.forEach(studentName => {
        // Define an object to store counts and sums for each month for the current student
        const studentData = {};

        // Initialize counts and sums to 0 for each month
        for (let month = 1; month <= 12; month++) {
            studentData[month] = { schoolDays: 0, presentCount: 0 };
        }

        // Iterate through newDataArray to calculate counts and sums for each month for the current student
        newDataArray.forEach(row => {
            if (row.year === selectedYear && row.name === studentName) {
                studentData[parseInt(row.month)].schoolDays += row.schoolDays;
                studentData[parseInt(row.month)].presentCount += row.presentCount;
            }
        });

        // Calculate average presence rate for each month for the current student
        for (let month = 1; month <= 12; month++) {
            const presenceRate = studentData[month].schoolDays === 0 ? 0 : (studentData[month].presentCount / studentData[month].schoolDays) * 100;
            monthlyAveragesByStudent.push({
                month: month.toString(),
                name: studentName,
                presenceRate: Number(presenceRate.toFixed(2))
            });
        }
    });

    //DIFFERENTTTTTTTTTTTTTT
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Filter monthlyAveragesByStudent to find the data for the selected student
    const selectedStudentAverages = monthlyAveragesByStudent.filter((item) => {
        // Check if the name exists in array_student
        if (array_student.includes(item.name.toUpperCase().trim())) {
            return true; // Include if the name is in array_student
        }
        return false; // Exclude if the name is not in array_student
    });


    // Initialize an object to store counts and sums for each month for the selected student
    const monthlyCounts = {};
    const monthlySums = {};

    // Initialize counts and sums to 0 for each month
    for (let month = 1; month <= 12; month++) {
        monthlyCounts[month] = 0;
        monthlySums[month] = 0;
    }

    // Iterate through selectedStudentAverages to calculate counts and sums for each month
    selectedStudentAverages.forEach(item => {
        const month = parseInt(item.month);
        monthlyCounts[month]++;
        monthlySums[month] += item.presenceRate;
    });

    // Initialize an array to store the average presence rate for each month
    const averagePresenceRates = [];

    // Calculate the average presence rate for each month
    for (let month = 1; month <= 12; month++) {
        const count = monthlyCounts[month];
        const sum = monthlySums[month];
        const average = count === 0 ? 0 : sum / count;
        averagePresenceRates.push({
            month: month.toString(),
            name: selectedteacher,
            presenceRate: Number(average.toFixed(2))
        });
    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Initialize 2D array to store the result
    const resultArray = [];

    // Iterate through selectedStudentAverages and push values into resultArray
    averagePresenceRates.forEach(item => {
        resultArray.push([item.month, item.name, item.presenceRate]);
    });

    // Output the filtered data
    object_linechart_att.loadLineChart(resultArray, '#line_chart_att_teacher', switch_showLable);
}

function processDataAndGenerateReports_SPECIFICstudent(data, selectedYear, selectedStudent, switch_showLable) {
    // Data cleaning
    const newDataArray = data;

    //MONTHLY
    // Define a new array to store the monthly averages by student
    const monthlyAveragesByStudent = [];

    // Get unique student names
    const uniqueNames = [...new Set(newDataArray.map(item => item.name))];

    // Iterate through each unique name
    uniqueNames.forEach(studentName => {
        // Define an object to store counts and sums for each month for the current student
        const studentData = {};

        // Initialize counts and sums to 0 for each month
        for (let month = 1; month <= 12; month++) {
            studentData[month] = { schoolDays: 0, presentCount: 0 };
        }

        // Iterate through newDataArray to calculate counts and sums for each month for the current student
        newDataArray.forEach(row => {
            if (row.year === selectedYear && row.name === studentName) {
                studentData[parseInt(row.month)].schoolDays += row.schoolDays;
                studentData[parseInt(row.month)].presentCount += row.presentCount;
            }
        });

        // Calculate average presence rate for each month for the current student
        for (let month = 1; month <= 12; month++) {
            const presenceRate = studentData[month].schoolDays === 0 ? 0 : (studentData[month].presentCount / studentData[month].schoolDays) * 100;
            monthlyAveragesByStudent.push({
                month: month.toString(),
                name: studentName,
                presenceRate: Number(presenceRate.toFixed(2))
            });
        }
    });

    // Filter monthlyAveragesByStudent to find the data for the selected student
    const selectedStudentAverages = monthlyAveragesByStudent.filter((item) => item.name.toUpperCase().trim() === selectedStudent);

    // Initialize 2D array to store the result
    const resultArray = [];

    // Iterate through selectedStudentAverages and push values into resultArray
    selectedStudentAverages.forEach(item => {
        resultArray.push([item.month, item.name, item.presenceRate]);
    });

    // Output the filtered data
    object_linechart_att.loadLineChart(resultArray, '#line_chart_att_student', switch_showLable);
}

function deleteCurrentChart() {
    object_linechart_att.deleteLineChart('#line_chart_att_NDO');
    object_linechart_att.deleteLineChart('#line_chart_att_class');
}

function update() {
    // Delete current shown graphs
    deleteCurrentChart();

    const selectedYear = document.getElementById('year_att_gender').value;
    const selectedCohort = document.getElementById('cohortSelect_attendance').value;
    const selectedClass = document.getElementById('classSelect_attendance').value;
    const switch_showLable = document.getElementById('switch_attendancePerformance').checked;

    // Call the function to generate the chart
    generateChart(selectedYear, selectedCohort, selectedClass, switch_showLable);

}

// Call function on page load
document.addEventListener('DOMContentLoaded', function() {
    
    // Call updateDashboard when the selectors change
    document.getElementById('year_att_gender').addEventListener('change', update);
    document.getElementById('cohortSelect_attendance').addEventListener('change', update);
    document.getElementById('classSelect_attendance').addEventListener('change', update);
    document.getElementById('switch_attendancePerformance').addEventListener('change', update);

    update();
});
    
import { File } from './js/dataCleaning/file.js';
import { DATABASE_LOADFILE } from './js/loadFile/database.js';
import { DATA_LOADFILE } from './js/loadFile/data.js';
import { DATACLEANING } from './js/dataCleaning/dataCleaning.js';
import { array_monthly_EachStudent } from './js/dataCleaning/arrayForEachStudent_weekTOmonth.js';
import { ARRAYMEANFORMONTH } from './js/dataCleaning/arrayMeanForMonth.js';
import { DropDownMenu_array } from './js/forHTML/dropDownMenu_array.js';
import { COHORTYEAR } from './js/analysis/cohort_year.js';
import { LINECHART } from './js/d3/lineChart.js';
import { LINECHART_CLASS } from './js/d3/lineChart_class.js';
import { LINECHART_TEACHER } from './js/d3/lineChart_teacher.js';
import { LINECHART_ATT } from './js/d3/lineChart_att.js';
import { STACKEDBARCHART } from './js/d3/stackedBarchart.js';
import { STACKEDBARCHART_CLASS } from './js/d3/stackedBarChart_class.js';
import { STACKEDBARCHART_TEACHER } from './js/d3/stackedBarChart_teacher.js';
import { LINEARREGRESSION_PREDICTION } from './js/analysis/linearRegression_Prediction.js';

//object
//
const object_file = new File();
const object_database_loadfile = new DATABASE_LOADFILE();
const object_data_cleaning = new DATACLEANING();
const object_array_monthly_EachStudent = new array_monthly_EachStudent();
const object_array_mean_for_month = new ARRAYMEANFORMONTH();
const object_count_cohort_in_which_year = new COHORTYEAR();
const object_linear_regression_prediction = new LINEARREGRESSION_PREDICTION();
    // chart
const object_linechart = new LINECHART();
const object_linechart_teacher = new LINECHART_TEACHER();
const object_linechart_att = new LINECHART_ATT();
const object_linechart_class = new LINECHART_CLASS();
const object_stackedbarchart = new STACKEDBARCHART();
const object_stackedbarchart_class = new STACKEDBARCHART_CLASS();
const object_stackedbarchart_teacher = new STACKEDBARCHART_TEACHER();

const toProperCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|\/)\w/g, (match) => {
        return match.toUpperCase();
    });
};

// Database_NDO
const Database_NDO = './datasets_csv/Database_NDO.csv';
object_database_loadfile.populate(Database_NDO);

// const firstCohort = 1;
// const firstYear = 2022;
const first = {cohort: 1, year: 2022};
const getCurrentYear = new Date().getFullYear();
const getCurrenMonth = (new Date().getMonth()) + 1;
let currentYear = 0;
if(getCurrenMonth < 7) {
    currentYear = getCurrentYear - 1; 
}
else {
    currentYear = getCurrentYear;
}

// ==============================================================================================
// Dropdown Menu - Teacher Name
// Function to push teacher names from data into the teacherNAME array
let teacherNAME = [];
const pushTeacherNames = (data) => {
    data.forEach(d => {
        if (d.teacher !== undefined) {
            teacherNAME.push(d.teacher.toUpperCase().trim());
        }
    });
};

const difference = currentYear - first.year;
const cohort_current = first.cohort + difference;

// get total five year cohort number
let temp = cohort_current;
let max_fiveYear_cohort = [];
max_fiveYear_cohort.push(cohort_current);
for(let i=5; i>1; i--) {
    if(temp > 1) {
        temp--;
        max_fiveYear_cohort.push(temp);
    }
}

// get all file name for futher for looping and store data
let allFileName_teacher = [];
for(let i=0; i<max_fiveYear_cohort.length; i++) {
    const selectedYear_teacher = document.getElementById('year_teacher').value;
    const fileName1 = `./datasets_csv/KPI_(C${max_fiveYear_cohort[i]})_${selectedYear_teacher}_English_KPIs.csv`;
    const fileName2 = `./datasets_csv/KPI_(C${max_fiveYear_cohort[i]})_${selectedYear_teacher}_Squash_KPIs.csv`;
    allFileName_teacher.push(fileName1);
    allFileName_teacher.push(fileName2);
}

object_file.loadMultipleCSVs(allFileName_teacher, (successfulFiles) => {
    // populate the menu
    const objects = successfulFiles.map(() => new DATA_LOADFILE());
    
    const loadAndParse = (index) => {
        if (index < successfulFiles.length) {
            objects[index].loadNparseCSV(successfulFiles[index], getCurrenMonth, () => {
                // console.log(objects[index]);
                pushTeacherNames(objects[index].objectData);
                loadAndParse(index + 1);
            });
        } else {
            const object_dropDownMenu_array = new DropDownMenu_array('teacherSelect', teacherNAME);
            object_dropDownMenu_array.populateSelection();
        }
    };
    
    loadAndParse(0);
});


// ==============================================================================================
//Function: Generate Chart
function generateChart(data_English, data_Squash, switch_showLable) {
    //Line Chart
    object_linechart.loadLineChart(data_English, data_Squash, "#line_chart", switch_showLable);
    //Stacked bar Chart
    const array_data_English = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject(data_English));
    const array_data_Squash = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject(data_Squash));
    object_stackedbarchart.loadStackedBarChart(array_data_English, "#stacked_bar_chart_english", switch_showLable);
    object_stackedbarchart.loadStackedBarChart(array_data_Squash, "#stacked_bar_chart_squash", switch_showLable);
}

function generateChart_teacher(data, namesArray, switch_showLable) {
    const mean_array = object_array_mean_for_month.countMean_teacher(data, namesArray);
    const new_mean_array = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array));
    // Stacked Bar Chart (selected cohort)
    object_stackedbarchart_teacher.loadStackedBarChart(new_mean_array, "#stacked_bar_chart_teacher", switch_showLable);
    // Line Chart (Selected cohort)
    object_linechart_teacher.loadLineChart_selectedCohort(mean_array, '#line_chart_teacher_selectedCohort', switch_showLable);

}

function generateChart_class(data1, data2, selectedClass, id_eng, id_squa, id_aveKPI, switch_showLable) {
    // arrange data
    const mean_array_eng = object_array_mean_for_month.countMean(data1, selectedClass);
    const mean_array_squa = object_array_mean_for_month.countMean(data2,selectedClass);
    const new_mean_array_eng = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array_eng));
    const new_mean_array_squa = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array_squa));
    //graph
    object_stackedbarchart_class.loadStackedBarChart(new_mean_array_eng, id_eng, switch_showLable);
    object_stackedbarchart_class.loadStackedBarChart(new_mean_array_squa, id_squa, switch_showLable);
    object_linechart_class.loadLineChart(mean_array_eng, mean_array_squa, id_aveKPI, switch_showLable);
}

export function findStudentInCohort(filename1, filename2, year, selectedStudent, callback) {

    const object_data_loadfile1 = new DATA_LOADFILE();
    const object_data_loadfile2 = new DATA_LOADFILE();

    object_data_loadfile1.loadNparseCSV(filename1, year, () => {
        const englishData = object_data_loadfile1.objectData;
        object_data_loadfile2.loadNparseCSV(filename2, year, () => {
            const squashData = object_data_loadfile2.objectData;
            // console.log(squashData);

            const englishStudent = englishData.find(student => student.name === selectedStudent);
            const squashStudent = squashData.find(student => student.name === selectedStudent);

            callback ({ englishStudent, squashStudent });
        });
    });
};

// Forecasting
export function calculation_chosenYear_value_oneLine(data, object) {
    const scores = data.scores;

    let temp = 0;
    let count = 0;
    for(let i=0; i<scores.length; i++) {
        const key = (Object.keys(scores[i])[0]);
        const value = (Object.values(scores[i])[0]);

        if(key === object) {
            if(value !== 0 && !isNaN(value)) {
                temp += value;
                count++;
            }
        }
    }

    const average = Number((temp/count).toFixed(2));
    return average;
}

export async function chart_forecasting(selectedStudent, cohort, id) {
    let array1 = [];

    const year_new_cohort = object_count_cohort_in_which_year.cohort_startyear_endyear(cohort);
    const start_year = year_new_cohort.start;
    const end_year = year_new_cohort.end;
    const currentYear = new Date().getFullYear();
    const cohortNum = parseInt(cohort.replace("COHORT", ""));

    for (let temp_year = start_year; temp_year <= end_year; temp_year++) {
        const englishFile = `./datasets_csv/KPI_(C${cohortNum})_${temp_year}_English_KPIs.csv`;

        if (temp_year <= currentYear) {
            try {
                const object_data_loadfile1 = new DATA_LOADFILE();
                await object_data_loadfile1.loadNparseCSV_async(englishFile, temp_year);
                const englishData = object_data_loadfile1.objectData;
    
                const englishStudent = englishData.find(student => student.name === selectedStudent);

                const english_aveMark = calculation_chosenYear_value_oneLine(englishStudent, 'OS');
    
                array1.push([temp_year, english_aveMark]);

            } catch (error) {
                console.error(`Error processing year ${temp_year}:`, error);
                array1 = null;
                console.log(`Fallback data for year ${temp_year}`, { english: array1 });
            }
        } else {
            array1.push([temp_year, NaN]);
        }
    }

    if(array1){
        // Predicting NaN values for English and squash data
        const array1_forecast = object_linear_regression_prediction.predictNaNValues(array1);
    
        // Chart
        object_linechart.loadLineChart_yearly(array1_forecast, id);
    }
}


// ==============================================================================================
// Student Performance Dashboard

export async function loadAndGenerateGraph_for_2022(programme1, programme2, chosenYear, chosenCohort, selectedStudent, id_eng, id_squa, switch_showLable) {
    const cohortNum = parseInt(chosenCohort.replace("COHORT", ""));
    const object_data_loadfile1 = new DATA_LOADFILE();
    const fileName1 = `./datasets_csv/KPI_(C${cohortNum})_${chosenYear}_${programme1}_KPIs.csv`;
    const object_data_loadfile2 = new DATA_LOADFILE();
    const fileName2 = `./datasets_csv/KPI_(C${cohortNum})_${chosenYear}_${programme2}_KPIs.csv`;

    await object_data_loadfile1.loadNparseCSV_async(fileName1, chosenYear);
    const data1 = object_data_loadfile1.parsedData;
    // Data Cleaning: change the last occurence "OCTOBER" to "NOVEMBER"
    const monthRow1 = data1[0].slice(2).map(month => month.split(' ')[0].toUpperCase()); // First row containing the month data, accessing the third element
    const lastIndexOct1 = monthRow1.lastIndexOf("OCTOBER");
    if (lastIndexOct1 !== -1) {
        monthRow1[lastIndexOct1] = "NOVEMBER";
    }
    data1[0] = data1[0].slice(0, 2).concat(monthRow1); // Replace the remaining space with the updated monthRow1

    await object_data_loadfile2.loadNparseCSV_async(fileName2, chosenYear);
    const data2 = object_data_loadfile2.parsedData;
    // Data Cleaning: change the last occurence "OCTOBER" to "NOVEMBER"
    const monthRow2 = data2[0].slice(2).map(month => month.split(' ')[0].toUpperCase()); // First row containing the month data, accessing the third element
    const lastIndexOct2 = monthRow2.lastIndexOf("OCTOBER");
    if (lastIndexOct2 !== -1) {
        monthRow2[lastIndexOct2] = "NOVEMBER";
    }
    data2[0] = data2[0].slice(0, 2).concat(monthRow2); // Replace the remaining space with the updated monthRow2

    const new_data1 = object_array_monthly_EachStudent.arrageArray_returnWithoutObject(data1);
    const nnew_data1 = object_array_monthly_EachStudent.replaceNaNWithMean(new_data1);
    const new_data2 = object_array_monthly_EachStudent.arrageArray_returnWithoutObject(data2);
    const nnew_data2 = object_array_monthly_EachStudent.replaceNaNWithMean(new_data2);

    // Chart
    const nnnew_data1 = object_data_cleaning.makeArrayWithoutOS_selectedStudent(nnew_data1, selectedStudent);
    const nnnew_data2 = object_data_cleaning.makeArrayWithoutOS_selectedStudent(nnew_data2, selectedStudent);

    object_stackedbarchart.loadStackedBarChart(nnnew_data1, id_eng, switch_showLable);
    object_stackedbarchart.loadStackedBarChart(nnnew_data2, id_squa, switch_showLable);

    // console.log(nnnew_data1);
    return {nnew_data1, nnew_data2};
}

function loadAndGenerateGraph(selectedStudentFIND_Database, englishStudent, squashStudent, switch_showLable) {
    let data_English=[];
    let data_Squash = [];
    let dataArray = [];
    // English
    dataArray.push(selectedStudentFIND_Database.nameofchild);
    dataArray.push(englishStudent.year);
    data_English.push(dataArray);
    dataArray = [];
    data_English.push(englishStudent.month);
    englishStudent.scores.forEach(element => {
        dataArray.push(element);
    });
    data_English.push(dataArray);
    dataArray = [];

    // Squash
    dataArray.push(selectedStudentFIND_Database.nameofchild);
    dataArray.push(squashStudent.year);
    data_Squash.push(dataArray);
    dataArray = [];
    data_Squash.push(squashStudent.month);
    squashStudent.scores.forEach(element => {
        dataArray.push(element);
    });
    data_Squash.push(dataArray);
    dataArray = [];

    // Generate Chart
    console.log(data_English);
    generateChart(data_English, data_Squash, switch_showLable);
}

function populateInfo(name, gender, cohort, class_CUB, dob, school) {
    let gender_icon;
    if (gender === 'MALE') {
        gender_icon = "./img/male_icon.png";
    } else if (gender === 'FEMALE') {
        gender_icon = "./img/female_icon.png";
    }
    const personalInfo = `
        <img src="./img/samplePic.jpg" class="sidebar_pic">
        <div class="sidebar_name_gender">
            <p><strong>${name}</strong></p>
            <img src="${gender_icon}" class="genderIcon">
        </div>
        <p>${cohort}</p>
        <p>${class_CUB}</p>
        <p>${dob}</p>
        <p>${school}</p>
    `;
    document.querySelector('.personal_info').innerHTML = personalInfo;
}

export async function generateChartsFor2022(selectedYear, selectedStudent, fileName1, fileName2, selectedStudent_cohort, id_aveKPI, id_eng, id_squa, switch_showLable) {
    const object_data_loadfile1 = new DATA_LOADFILE();
    const object_data_loadfile2 = new DATA_LOADFILE();

    await object_data_loadfile1.loadNparseCSV_async(fileName1, selectedYear);
    const data_English_KPI = object_data_loadfile1.objectData;

    await object_data_loadfile2.loadNparseCSV_async(fileName2, selectedYear);
    const data_Squash_KPI = object_data_loadfile2.objectData;
    const selectedStudentFIND_Eng_KPI_2022_COHORT1 = data_English_KPI.find(student => student.name === selectedStudent);
    const selectedStudentFIND_Squash_KPI_2022_COHORT1 = data_Squash_KPI.find(student => student.name === selectedStudent);

    let data_English;
    let data_Squash;
    let array1 = [];
    let array2 = [];
    // 2022_COHORT 1_ENGLISH
    if (selectedStudentFIND_Eng_KPI_2022_COHORT1) {
        let dataArray = [];

        dataArray.push(selectedStudent);
        dataArray.push(selectedStudentFIND_Eng_KPI_2022_COHORT1.year);
        array1.push(dataArray);
        dataArray = [];
        array1.push(selectedStudentFIND_Eng_KPI_2022_COHORT1.month);
        selectedStudentFIND_Eng_KPI_2022_COHORT1.scores.forEach(element => {
            dataArray.push(element);
        });
        array1.push(dataArray);
        dataArray = [];

        data_English = object_array_monthly_EachStudent.arrangeArray_OS(array1);
    }

    // 2022_COHORT 1_SQUASH
    if (selectedStudentFIND_Squash_KPI_2022_COHORT1) {
        let dataArray = [];

        dataArray.push(selectedStudent);
        dataArray.push(selectedStudentFIND_Squash_KPI_2022_COHORT1.year);
        array2.push(dataArray);
        dataArray = [];
        array2.push(selectedStudentFIND_Squash_KPI_2022_COHORT1.month);
        selectedStudentFIND_Squash_KPI_2022_COHORT1.scores.forEach(element => {
            dataArray.push(element);
        });
        array2.push(dataArray);
        dataArray = [];

        data_Squash = object_array_monthly_EachStudent.arrangeArray_OS(array2);
    }

    // Line Chart
    object_linechart.loadLineChart(data_English, data_Squash, id_aveKPI, switch_showLable);

    // Stacked bar Chart
    const {nnew_data1, nnew_data2} = await loadAndGenerateGraph_for_2022('English', 'Squash', selectedYear, selectedStudent_cohort, selectedStudent, id_eng, id_squa, switch_showLable);
    return {nnew_data1, nnew_data2};
}


import { generateChart_StudentPerformacneDashboard } from './display_attendance.js';
function updateChart(selectedYear, selectedStudent, switch_showLable) {
    //delete the currrent graph
    deleteChart ();

    object_database_loadfile.loadNparseCSV(Database_NDO, () => {
        const data_Database_NDO = object_database_loadfile.objectData;
        const selectedStudentFIND_Database = data_Database_NDO.find(student => student.nameofchild === selectedStudent);
        const selectedStudent_cohort = selectedStudentFIND_Database.cohort.replaceAll(' ','');
        const cohortNum = parseInt(selectedStudent_cohort.replace("COHORT", ""));
        const selectedStudent_gender = selectedStudentFIND_Database.gender;
        const selectedStudent_class = selectedStudentFIND_Database.class;
        const selectedStudent_DOB = (selectedStudentFIND_Database.dateofbirth).split(" ")[0];
        const selectedStudent_school = selectedStudentFIND_Database.nameofschool;

    
        // update personalInfo
        populateInfo(toProperCase(selectedStudent), selectedStudent_gender, toProperCase(selectedStudent_cohort), toProperCase(selectedStudent_class), selectedStudent_DOB, selectedStudent_school);

        const fileName1 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_English_KPIs.csv`;
        const fileName2 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_Squash_KPIs.csv`;
    
        // Retrieve data required
        if (selectedStudentFIND_Database) {
            findStudentInCohort(fileName1, fileName2, selectedYear, selectedStudent, ({ englishStudent, squashStudent }) => {
    
            // Forecasting
            chart_forecasting(selectedStudent, selectedStudent_cohort, "#line_chart_yearly");
            generateChart_StudentPerformacneDashboard(selectedYear, selectedStudent, '#line_chart_att_student', switch_showLable);
    
    
    
            // 2022

            if(selectedYear === '2022') { // ONLY FOR 2022
                generateChartsFor2022(selectedYear, selectedStudent, fileName1, fileName2,selectedStudent_cohort, 
                    "#line_chart", "#stacked_bar_chart_english", "#stacked_bar_chart_squash", switch_showLable);
                
            }
            else {
                // Graph & Correlation
                loadAndGenerateGraph(selectedStudentFIND_Database, englishStudent, squashStudent, switch_showLable);
            }
            });
            
        }
    });
    
}

function deleteChart () {
    document.querySelector('.personal_info').innerHTML = '';
    object_linechart.deleteLineChart("#line_chart");
    object_linechart.deleteLineChart_yearly();
    object_stackedbarchart.deleteStackedBarChart("#stacked_bar_chart_english", "#stacked_bar_chart_squash");
    object_linechart_att.deleteLineChart('#line_chart_att_student');
}

// Class Performance Dashboard

export async function loadAndGenerateGraph_for_2022_class(programme1, programme2, chosenYear, chosenCohort, selectedClass, id_ave, id_eng, id_squa, switch_showLable) {
    const cohortNum = parseInt(chosenCohort.replace("COHORT", ""));
    const object_data_loadfile1 = new DATA_LOADFILE();
    const fileName1 = `./datasets_csv/KPI_(C${cohortNum})_${chosenYear}_${programme1}_KPIs.csv`;
    const object_data_loadfile2 = new DATA_LOADFILE();
    const fileName2 = `./datasets_csv/KPI_(C${cohortNum})_${chosenYear}_${programme2}_KPIs.csv`;

    await object_data_loadfile1.loadNparseCSV_async(fileName1, chosenYear);
    const data1 = object_data_loadfile1.parsedData;
    // Data Cleaning: change the last occurence "OCTOBER" to "NOVEMBER"
    const monthRow1 = data1[0].slice(2).map(month => month.split(' ')[0].toUpperCase()); // First row containing the month data, accessing the third element
    const lastIndexOct1 = monthRow1.lastIndexOf("OCTOBER");
    if (lastIndexOct1 !== -1) {
        monthRow1[lastIndexOct1] = "NOVEMBER";
    }
    data1[0] = data1[0].slice(0, 2).concat(monthRow1); // Replace the remaining space with the updated monthRow1

    await object_data_loadfile2.loadNparseCSV_async(fileName2, chosenYear);
    const data2 = object_data_loadfile2.parsedData;
    // Data Cleaning: change the last occurence "OCTOBER" to "NOVEMBER"
    const monthRow2 = data2[0].slice(2).map(month => month.split(' ')[0].toUpperCase()); // First row containing the month data, accessing the third element
    const lastIndexOct2 = monthRow2.lastIndexOf("OCTOBER");
    if (lastIndexOct2 !== -1) {
        monthRow2[lastIndexOct2] = "NOVEMBER";
    }
    data2[0] = data2[0].slice(0, 2).concat(monthRow2); // Replace the remaining space with the updated monthRow2

    const new_data1 = object_array_monthly_EachStudent.arrageArray_returnWithoutObject(data1);
    const nnew_data1 = object_array_monthly_EachStudent.replaceNaNWithMean(new_data1);
    const new_data2 = object_array_monthly_EachStudent.arrageArray_returnWithoutObject(data2);
    const nnew_data2 = object_array_monthly_EachStudent.replaceNaNWithMean(new_data2);

    // Chart
    generateChart_class(nnew_data1, nnew_data2, selectedClass, 
        id_eng, id_squa, id_ave, switch_showLable);

    return {nnew_data1, nnew_data2};
}

function updateChart_class(selectedClass, selectedCohort, selectedYear, switch_showLable) {
    const object_data_loadfile1 = new DATA_LOADFILE();
    const object_data_loadfile2 = new DATA_LOADFILE();
    
    // delete current chart
    deleteChart_class();

    // Retrieve value from user select in "html"
    const cohort = selectedCohort.replaceAll(" ", "");
    const cohortNum = cohort.replace("COHORT", "");

    const fileName1 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_English_KPIs.csv`;
    const fileName2 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_Squash_KPIs.csv`;
    
    // Different cohort starts from different year
    // show the message, that chosen cohort is not start from chosen year
    // Elements to display messages
    const messageDisplayDivs = [
        document.getElementById('messageDisplay1'),
        document.getElementById('messageDisplay2'),
        document.getElementById('messageDisplay3')
    ];

    // Display a message in all message display divs
    const displayMessage = (message) => {
        messageDisplayDivs.forEach(div => div.innerText = message);
    };

    const year_cohort = object_count_cohort_in_which_year.cohort_startyear_endyear(cohort);
    const start = year_cohort.start;
    const end = year_cohort.end;
    if(selectedYear >= start && selectedYear <= end) {
        displayMessage('');
        // 2022
        if(selectedCohort === 'COHORT 1' && selectedYear === '2022') {
            loadAndGenerateGraph_for_2022_class('English', 'Squash', selectedYear, selectedCohort, selectedClass,
                '#line_chart_class', "#stacked_bar_chart_class_english", "#stacked_bar_chart_class_squash", switch_showLable);
            // loadAndGenerateGraph_for_2022('English', 'Squash',selectedYear, selectedCohort, function(nnew_data1, nnew_data2) {
            //     // Chart
            //     generateChart_class(nnew_data1, nnew_data2, selectedClass, 
            //         "#stacked_bar_chart_class_english", "#stacked_bar_chart_class_squash", '#line_chart_class', switch_showLable);
            // });
        }
        else {
            object_data_loadfile1.loadNparseCSV(fileName1, selectedYear, () => {
                const data1 = object_data_loadfile1.parsedData;
                object_data_loadfile2.loadNparseCSV(fileName2, selectedYear, () => {
                    const data2 = object_data_loadfile2.parsedData;
                    // Chart
                    generateChart_class(data1, data2, selectedClass,
                        "#stacked_bar_chart_class_english", "#stacked_bar_chart_class_squash", '#line_chart_class', switch_showLable);
                });
            });
        }
    }
    else {
        if(!isNaN(start) && !isNaN(end)) {
            displayMessage(`${selectedCohort} is started in ${start} & ended in ${end}`);
        }
    }
}

function deleteChart_class() {
    object_linechart_class.deleteLineChart();
    object_stackedbarchart_class.deleteStackedBarChart_class("#stacked_bar_chart_class_english", "#stacked_bar_chart_class_squash");
}

// Get the student names in array depending on the teacher
export function filterAndAddNames(dataset, selectedteacher) {
    const namesSet = new Set();
    dataset.forEach(student => {
        if(student.teacher.includes('/') ? student.teacher.split('/').includes(selectedteacher) : student.teacher === selectedteacher) {
            namesSet.add(student.name);
        }
    });
    return [...namesSet];
}

// Teacher Performance Dashboard

import { generateChart_TeacherPerformacneDashboard } from './display_attendance.js';

function populateInfo_teacher(name, programme) {
    // console.log(programme);
    let programme_pic;
    let measurement_table;
    if (programme === 'English Teacher') {
        programme_pic = "./img/EnglishBook.png";
        measurement_table = `
        <table>
            <caption>English Measurements</caption>
            <!-- <tr>
                <th colspan="4">English Measurement</th>
            </tr> -->
            <tr>
                <td>R - Reading</td>
                <td>W - Writing</td>
                <td>L - Listening</td>
                <td>S - Speaking</td>
            </tr>
        </table>`;
    } else if (programme === 'Squash Teacher') {
        programme_pic = "./img/squash_racket.png";
        measurement_table = `
        <table>
            <caption>Squash Measurements</caption>
            <tr>
                <td>E - Endurance</td>
                <td>C - Coordinate</td>
                <td>S - Skill</td>
                <td>M - Movement</td>
            </tr>
            <table>

                <tr>
                    <td colspan="3" style="text-align: center;">FH - Forehand; BH - Backhand</td>
                </tr>
                <tr>
                    <td>D - Drive</td>
                    <td>S - Serve</td>
                    <td>V - Volley</td>
                </tr>
                <tr>
                    <td>CC - Cross Court</td>
                    <td>RS - Return of Serve</td>
                    <td>B - Boast</td>
                </tr>
            </table>
        </table>`;
    }
    const personalInfo = `
        <img src="./img/teacher.png" class="sidebar_pic">
        <div class="sidebar_name_gender">
            <p><strong>${name}</strong></p>
            <img src="${programme_pic}" class="genderIcon">
        </div>
        <p>${programme}</p>
            <div class="table-container">
                ${measurement_table}
            </div>
    `;
    document.querySelector('.teacher_info').innerHTML = personalInfo;
}

function processDataRows(dataRows, data) {
    for (let i = 2; i < dataRows.length; i++) {
        let array_row = [];
        for (let a = 0; a < data[0].length; a++) {
            let found = false;
            let month_refer = data[0][a];
            let header_refer = data[1][a];
            let value = "#DIV/0!";

            for (let j = 0; j < dataRows[0].length; j++) {
                let month = dataRows[0][j];
                let header = dataRows[1][j];

                if ((month === '' || month_refer === month) && header_refer === header) {
                    value = dataRows[i][j];
                    found = true;
                    break;
                }
            }

            array_row.push(value);
        }

        data.push(array_row);
    }
    // console.log(data);
}

async function updateChart_teacher(selectedYear, selectedteacher, selectedCohort, switch_showLable) {
    // Delete current chart
    deleteChart_teacher();

    const object_data_loadfile1 = new DATA_LOADFILE();
    const object_data_loadfile2 = new DATA_LOADFILE();

    let min_max_fiveYear_cohort;
    if(Number(selectedYear) === getCurrentYear) {
        min_max_fiveYear_cohort = object_count_cohort_in_which_year.fiveYear_cohort(currentYear);
    }
    else {
        min_max_fiveYear_cohort = object_count_cohort_in_which_year.fiveYear_cohort(selectedYear);
    }
    // console.log(min_max_fiveYear_cohort);
    
    let allFileName_eng = [];
    for(let i=0; i<5; i++) {
        if(i<min_max_fiveYear_cohort.current) {
            const fileName = `./datasets_csv/KPI_(C${i+1})_${selectedYear}_English_KPIs.csv`;
            allFileName_eng.push(fileName);
        }
    }
    let allFileName_squa = [];
    for(let i=0; i<5; i++) {
        if(i<min_max_fiveYear_cohort.current) {
            const fileName = `./datasets_csv/KPI_(C${i+1})_${selectedYear}_Squash_KPIs.csv`;
            allFileName_squa.push(fileName);
        }
    }
    object_file.loadMultipleCSVs(allFileName_eng, (successfulFiles) => {
        
    });

    if(selectedCohort === '') {
        let data_objectName = [];
        let data = [];

        for(let i=0; i<allFileName_eng.length;i++) {
            const object_data_loadfile = new DATA_LOADFILE();
            await object_data_loadfile.loadNparseCSV_async(allFileName_eng[i], selectedYear);
            const data1 = object_data_loadfile.parsedData;
            const data_objectName1 = object_data_loadfile.objectData;
            data_objectName.push(...data_objectName1);
            if(i>0) {
                data.push(...data1.slice(2));
            }
            else{
                data.push(...data1);
            }
        }

        const English = data_objectName.find(student => student.teacher === selectedteacher);
        // Chart
        if(English && selectedteacher) {
            // Chart
            const namesArray = filterAndAddNames(data_objectName, selectedteacher);
            generateChart_teacher(data, namesArray, switch_showLable);
            generateChart_TeacherPerformacneDashboard(selectedYear, selectedteacher, namesArray, '#line_chart_att_teacher', switch_showLable);
            populateInfo_teacher(toProperCase(selectedteacher), 'English Teacher');
        }
        else if(selectedteacher) { // Squash
            data_objectName = [];
            data = [];
            
            let header_array = [];
            for(let i=0; i<allFileName_squa.length;i++) {
                const object_data_loadfile = new DATA_LOADFILE();
                await object_data_loadfile.loadNparseCSV_async(allFileName_squa[i], selectedYear);
                const data1 = object_data_loadfile.parsedData;
                header_array.push({month: data1[0], header: data1[1]});
            }
            let getHeader = [];
            let maxHeaderLength = 0;

            header_array.forEach(({ month, header }) => {
                if (header.length > maxHeaderLength) {
                    getHeader = [month, header];
                    maxHeaderLength = header.length;
                }
            });

            // Ensures getHeader has at least one entry if no headers are longer than the initial one.
            if (getHeader.length === 0 && header_array.length > 0) {
                getHeader = [header_array[0].month, header_array[0].header];
            }
            for(let i=0; i<allFileName_squa.length;i++) {
                const object_data_loadfile = new DATA_LOADFILE();
                await object_data_loadfile.loadNparseCSV_async(allFileName_squa[i], selectedYear);
                const data1 = object_data_loadfile.parsedData;
                const data_objectName1 = object_data_loadfile.objectData;
                data_objectName.push(...data_objectName1);
                if(i===0) {
                    let monthcount = 0;
                    let prevMonth = '';
                    let new_month = [];
                    let new_header = [];
                    for(let i=0; i<getHeader[0].length; i++) {
                        const month = getHeader[0][i];
                        const header = getHeader[1][i];
                        if(prevMonth === '') {
                            prevMonth = month
                            monthcount++;
                        }
                        else if(prevMonth === month) {
                            monthcount++;
                        }
                        else if(prevMonth !== month) {
                            prevMonth = month
                            monthcount = 0;
                        }
                        if(monthcount === 1) {
                            if(header !== 'E' && header !== ''){
                                new_header.push('E');
                                new_header.push('C');
                                new_header.push('S');
                                new_header.push(header);
                                new_month.push(prevMonth);
                                new_month.push(prevMonth);
                                new_month.push(prevMonth);
                                new_month.push(month);

                            }
                            else {
                                new_month.push(month);
                                new_header.push(header);
                            }
                        }
                        else {
                            new_month.push(month);
                            new_header.push(header);

                        }
                    }
                    data.push(new_month);
                    data.push(new_header);
                }
                processDataRows(data1, data);
            }
            const namesArray = filterAndAddNames(data_objectName, selectedteacher);
            generateChart_teacher(data, namesArray, switch_showLable);
            generateChart_TeacherPerformacneDashboard(selectedYear, selectedteacher, namesArray, '#line_chart_att_teacher', switch_showLable);
            populateInfo_teacher(toProperCase(selectedteacher), 'Squash Teacher');
        }
    }
    else {
        // Retrieve value from user select in "html"
        const selectedCohort_withoutSpace = selectedCohort.replaceAll(' ', '');
        const cohortNum = parseInt(selectedCohort_withoutSpace.replace("COHORT", ""));
    
    
        const fileName1 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_English_KPIs.csv`;
        const fileName2 = `./datasets_csv/KPI_(C${cohortNum})_${selectedYear}_Squash_KPIs.csv`;
    
        object_data_loadfile1.loadNparseCSV(fileName1, selectedYear, () => {
            const data1 = object_data_loadfile1.parsedData;
            const data1_objectName = object_data_loadfile1.objectData;
            
            object_data_loadfile2.loadNparseCSV(fileName2, selectedYear, () => {
                const data2 = object_data_loadfile2.parsedData;
                const data2_objectName = object_data_loadfile2.objectData;
                // console.log(data2_objectName);
                const English = data1_objectName.find(student => student.teacher === selectedteacher);
                const Squash = data2_objectName.find(student => student.teacher === selectedteacher);
                // Chart
                if(English) {
                    const namesArray = filterAndAddNames(data1_objectName, selectedteacher);
                    generateChart_teacher(data1, namesArray, switch_showLable);
                    generateChart_TeacherPerformacneDashboard(selectedYear, selectedteacher, namesArray, '#line_chart_att_teacher', switch_showLable);
                    populateInfo_teacher(toProperCase(selectedteacher), 'English Teacher');
                }
                else if(Squash) {
                    const namesArray = filterAndAddNames(data2_objectName, selectedteacher);
                    generateChart_teacher(data2, namesArray, switch_showLable);
                    generateChart_TeacherPerformacneDashboard(selectedYear, selectedteacher, namesArray, '#line_chart_att_teacher', switch_showLable);
                    populateInfo_teacher(toProperCase(selectedteacher), 'Squash Teacher');
                }
            });
        });
    }
}

function deleteChart_teacher() {
    document.querySelector('.teacher_info').innerHTML = '';
    object_linechart_att.deleteLineChart('#line_chart_att_teacher');
    object_linechart_teacher.deleteLineChart();
    object_stackedbarchart_teacher.deleteStackedBarChart_teacher("#stacked_bar_chart_teacher");
}

function updateDashboard() {

    // Student Performance Dashboard
    updateStudentPerformanceDashboard();

    // Class Performance Dashboard
    updateClassPerformanceDashboard();

    // Teacher Performance Dashboard
    updateTeacherPerformanceDashboard();

}

function updateStudentPerformanceDashboard() {

    // Student Performance Dashboard
    const switch_studentPerformance = document.getElementById('switch_studentPerformance').checked;
    const selectedYear1 = document.getElementById('year_student_line').value;
    const selectedStudent = document.getElementById('studentSelect').value;
    updateChart(selectedYear1, selectedStudent, switch_studentPerformance);

}

function updateClassPerformanceDashboard() {

    // Class Performance Dashboard
    const switch_classPerformance = document.getElementById('switch_classPerformance').checked;
    const selectedClass = document.getElementById('classSelect').value;
    const selectedCohort1 = document.getElementById('cohortSelect').value;
    const selectedYear2 = document.getElementById('year_class').value;
    updateChart_class(selectedClass, selectedCohort1, selectedYear2, switch_classPerformance);

}

function updateTeacherPerformanceDashboard() {

    // Teacher Performance Dashboard
    const switch_teacherPerformance = document.getElementById('switch_teacherPerformance').checked;
    const selectedYear3 = document.getElementById('year_teacher').value;
    const selectedteacher = document.getElementById('teacherSelect').value;
    const selectedCohort2 = document.getElementById('cohortSelect_teacher').value;
    updateChart_teacher(selectedYear3, selectedteacher, selectedCohort2, switch_teacherPerformance);

}


document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();

    // Student Performance Dashboard
    document.getElementById('switch_studentPerformance').addEventListener('change', updateStudentPerformanceDashboard);
    document.getElementById('studentSelect').addEventListener('change', updateStudentPerformanceDashboard);
    document.getElementById('year_student_line').addEventListener('change', updateStudentPerformanceDashboard);

    // Class Performance Dashboard
    document.getElementById('switch_classPerformance').addEventListener('change', updateClassPerformanceDashboard);
    document.getElementById('classSelect').addEventListener('change', updateClassPerformanceDashboard);
    document.getElementById('cohortSelect').addEventListener('change', updateClassPerformanceDashboard);
    document.getElementById('year_class').addEventListener('change', updateClassPerformanceDashboard); 

    // Teacher Performance Dashboard
    document.getElementById('switch_teacherPerformance').addEventListener('change', updateTeacherPerformanceDashboard);
    document.getElementById('teacherSelect').addEventListener('change', updateTeacherPerformanceDashboard);
    document.getElementById('year_teacher').addEventListener('change', updateTeacherPerformanceDashboard); 
    document.getElementById('cohortSelect_teacher').addEventListener('change', updateTeacherPerformanceDashboard);

});

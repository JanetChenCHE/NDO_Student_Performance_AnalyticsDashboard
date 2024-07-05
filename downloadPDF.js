import { findStudentInCohort } from "./display.js";
import { filterAndAddNames } from "./display.js";
import { ARRAYMEANFORMONTH } from './js/dataCleaning/arrayMeanForMonth.js';
import { DATACLEANING } from './js/dataCleaning/dataCleaning.js';
import { DATA_LOADFILE } from './js/loadFile/data.js';
import { LINECHART } from './js/d3/lineChart.js';
import { LINECHART_CLASS } from './js/d3/lineChart_class.js';
import { LINECHART_TEACHER } from './js/d3/lineChart_teacher.js';
import { STACKEDBARCHART } from './js/d3/stackedBarchart.js';
import { STACKEDBARCHART_CLASS } from './js/d3/stackedBarChart_class.js';
import { STACKEDBARCHART_TEACHER } from './js/d3/stackedBarChart_teacher.js';

// object 
const object_array_mean_for_month = new ARRAYMEANFORMONTH();
const object_data_cleaning = new DATACLEANING();
const object_data_loadfile1 = new DATA_LOADFILE();
const object_data_loadfile2 = new DATA_LOADFILE();
const object_linechart = new LINECHART();
const object_linechart_teacher = new LINECHART_TEACHER();
const object_linechart_class = new LINECHART_CLASS();
const object_stackedbarchart = new STACKEDBARCHART();
const object_stackedbarchart_class = new STACKEDBARCHART_CLASS();
const object_stackedbarchart_teacher = new STACKEDBARCHART_TEACHER();

const toProperCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|\/)\w/g, (match) => {
        return match.toUpperCase();
    });
};

export async function downloadReports() {
    const button = document.querySelector("button[onclick='downloadReports()']");
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressLabel = document.getElementById('progress-label');

    button.disabled = true;
    button.textContent = "Loading...";
    progressContainer.style.display = 'block';

    const { jsPDF } = window.jspdf;
    const zip = new JSZip();
    const selectedYear = document.getElementById("year").value;
    const selectedCohort = document.getElementById("cohort").value;
    const fileName = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_English_KPIs.csv`;
    
    // Load student data
    await object_data_loadfile1.loadNparseCSV_async(fileName, selectedYear);
    const studentData = object_data_loadfile1.objectData;
    const totalStudentFiles = studentData.length;

    // Function to update progress for student reports
    let completedStudentFiles = 0;
    const updateStudentProgress = () => {
        completedStudentFiles++;
        const progressPercentage = Math.round((completedStudentFiles / totalStudentFiles) * 100);
        progressBar.value = progressPercentage;
        progressText.textContent = `${progressPercentage}%`;
        progressLabel.textContent = `Downloading student report: ${completedStudentFiles}/${totalStudentFiles}`;
    };

    // const name = (("Isabelle Kong Jia Wei").toUpperCase());
    // const studentPdfData = await generateStudentPdf(selectedYear, selectedCohort, name);
    // zip.file(`student/report_${toProperCase(name).replace(/\s/g, '_').replace(/\//g, '_')}_${selectedYear}.pdf`, studentPdfData);
    // updateStudentProgress();

    // Generate student reports
    for (const student of studentData) {
        d3.select("#aveKPI_PDF_student svg").remove();
        d3.select("#engKPI_PDF_student svg").remove();
        d3.select("#squaKPI_PDF_student svg").remove();
        d3.select("#yAveKPI_PDF_student svg").remove();
        d3.select('#att_PDF_student svg').remove();
        const studentPdfData = await generateStudentPdf(selectedYear, selectedCohort, student.name, student.class);
        zip.file(`student/report_${toProperCase(student.name).replace(/\s/g, '_').replace(/\//g, '_')}_${selectedYear}.pdf`, studentPdfData);
        updateStudentProgress();
    }

    // Load teacher data
    let teachers = new Set();
    let totalTeacherFiles = teachers.length;

    // Function to update progress for teacher reports
    let completedTeacherFiles = 0;
    const updateTeacherProgress = () => {
        completedTeacherFiles++;
        const progressPercentage = Math.round(((completedStudentFiles + completedTeacherFiles) / (totalStudentFiles + totalTeacherFiles)) * 100);
        progressBar.value = progressPercentage;
        progressText.textContent = `${progressPercentage}%`;
        progressLabel.textContent = `Downloading teacher report: ${completedTeacherFiles}/${totalTeacherFiles}`;
    };

    // Teacher
    const hasTeacherKey = studentData.some(obj => 'teacher' in obj);
    if (hasTeacherKey) {
        const fileName2 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_Squash_KPIs.csv`;
        await object_data_loadfile2.loadNparseCSV_async(fileName2, selectedYear);
        const data2 = object_data_loadfile2.objectData;


        studentData.forEach((student) => {
            if (student.teacher && !student.teacher.includes("/") && !student.teacher.includes("-")) {
                teachers.add(student.teacher);
            }
        });

        data2.forEach((student) => {
            if (student.teacher && !student.teacher.includes("/") && !student.teacher.includes("-")) {
                teachers.add(student.teacher);
            }
        });

        teachers = Array.from(teachers);
        totalTeacherFiles = teachers.length;

        // Download teacher reports
        for (const teacher of teachers) {
            d3.select("#KPI_PDF_teacher svg").remove();
            d3.select("#aveKPI_PDF_teacher svg").remove();
            d3.select("#att_PDF_teacher svg").remove();
            const teacherPdfData = await generateTeacherPdf(selectedYear, selectedCohort, teacher);
            zip.file(`teacher/report_${teacher}_${selectedYear}_Cohort${selectedCohort}.pdf`, teacherPdfData);
            updateTeacherProgress();
        }
    }

    // Generate class report
    d3.select("#engKPI_PDF_class svg").remove();
    d3.select("#squaKPI_PDF_class svg").remove();
    d3.select("#aveKPI_PDF_class svg").remove();
    d3.select("#att_PDF_class svg").remove();
    d3.select("#engKPI_PDF_happy svg").remove();
    d3.select("#squaKPI_PDF_happy svg").remove();
    d3.select("#aveKPI_PDF_happy svg").remove();
    d3.select("#att_PDF_happy svg").remove();
    d3.select("#engKPI_PDF_kind svg").remove();
    d3.select("#squaKPI_PDF_kind svg").remove();
    d3.select("#aveKPI_PDF_kind svg").remove();
    d3.select("#att_PDF_kind svg").remove();
    d3.select("#engKPI_PDF_strong svg").remove();
    d3.select("#squaKPI_PDF_strong svg").remove();
    d3.select("#aveKPI_PDF_strong svg").remove();
    d3.select("#att_PDF_strong svg").remove();
    const classReportPdfData = generateClassPdf(selectedYear, selectedCohort);
    zip.file(`C${selectedCohort}_class_report_${selectedYear}.pdf`, classReportPdfData);

    // Generate ZIP file and download
    zip.generateAsync({ type: 'blob' }, (metadata) => {
        const progressPercentage = Math.round((metadata.percent / 100) * 100);
        progressBar.value = progressPercentage;
        progressText.textContent = `${progressPercentage}%`;
        progressLabel.textContent = `Generating ZIP file...`;
    }).then(function(content) {
        saveAs(content, `reports_${selectedYear}_Cohort${selectedCohort}.zip`);
        button.disabled = false;
        button.textContent = "Download Reports";
        progressContainer.style.display = 'none';
        modal.style.display = "none";
    }).catch(function(error) {
        console.error("Error generating ZIP file:", error);
        button.disabled = false;
        button.textContent = "Download Reports";
        progressContainer.style.display = 'none';
    });
}


import { generateChartsFor2022 } from "./display.js";
import { chart_forecasting } from "./display.js";
import { generateChart_StudentPerformacneDashboard } from "./display_attendance.js";
async function generateStudentPdf(selectedYear, selectedCohort, selectedStudent, className) {
    const { jsPDF } = window.jspdf;

    const fileName1 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_English_KPIs.csv`;
    const fileName2 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_Squash_KPIs.csv`;

    return new Promise((resolve, reject) => {
        findStudentInCohort(fileName1, fileName2, selectedYear, selectedStudent, async ({ englishStudent, squashStudent }) => {
            let data_English = [];
            let data_Squash = [];
            let dataArray = [];
            if (Number(selectedYear) === 2022) {
                // Generate charts for the year 2022
                //(programme1, programme2, chosenYear, chosenCohort, selectedStudent, id_eng, id_squa, switch_showLable)
                const {nnew_data1, nnew_data2}  = await generateChartsFor2022(
                    selectedYear, selectedStudent, fileName1, fileName2, 'COHORT' + selectedCohort, 
                    "#aveKPI_PDF_student", "#engKPI_PDF_student", "#squaKPI_PDF_student");
                data_English = object_data_cleaning.makeArray_selectedStudent(nnew_data1, selectedStudent);
                data_Squash = object_data_cleaning.makeArray_selectedStudent(nnew_data2, selectedStudent);
            } else {
                // English Data Processing
                if (englishStudent) {
                    dataArray.push(selectedStudent);
                    dataArray.push(englishStudent.year);
                    data_English.push(dataArray);
                    dataArray = [];
                    data_English.push(englishStudent.month);
                    englishStudent.scores.forEach(element => {
                        dataArray.push(element);
                    });
                    data_English.push(dataArray);
                    dataArray = [];
                }

                // Squash Data Processing
                if (squashStudent) {
                    dataArray.push(selectedStudent);
                    dataArray.push(squashStudent.year);
                    data_Squash.push(dataArray);
                    dataArray = [];
                    data_Squash.push(squashStudent.month);
                    squashStudent.scores.forEach(element => {
                        dataArray.push(element);
                    });
                    data_Squash.push(dataArray);
                    dataArray = [];
                }

                // Generate Charts
                // Line Chart
                if (englishStudent && squashStudent) {
                    // console.log(data_English);
                    object_linechart.loadLineChart(data_English, data_Squash, "#aveKPI_PDF_student");
                }

                // Stacked Bar Chart for English
                if (englishStudent) {
                    const array_data_English = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject(data_English));
                    object_stackedbarchart.loadStackedBarChart(array_data_English, "#engKPI_PDF_student");
                }

                // Stacked Bar Chart for Squash
                if (squashStudent) {
                    const array_data_Squash = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject(data_Squash));
                    object_stackedbarchart.loadStackedBarChart(array_data_Squash, "#squaKPI_PDF_student");
                }
            }

            chart_forecasting(selectedStudent, "COHORT" + selectedCohort, "#yAveKPI_PDF_student");
            generateChart_StudentPerformacneDashboard(selectedYear, selectedStudent, "#att_PDF_student", true);

            // PNG Conversion
            let chartPng_eng, chartPng_squ, chartPng_ave, chartPng_year, chartPng_att;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for SVG to be created

            // Line Chart
            if (englishStudent && squashStudent) {
                const chartSvg_ave = document.querySelector("#aveKPI_PDF_student svg");
                chartPng_ave = await svgToPng(chartSvg_ave);
            }

            // Stacked Bar Chart for English
            if (englishStudent) {
                const chartSvg_eng = document.querySelector("#engKPI_PDF_student svg");
                chartPng_eng = await svgToPng(chartSvg_eng);
            }

            // Stacked Bar Chart for Squash
            if (squashStudent) {
                const chartSvg_squ = document.querySelector("#squaKPI_PDF_student svg");
                chartPng_squ = await svgToPng(chartSvg_squ);
            }

            // Yearly Line Chart
            const chartSvg_year = document.querySelector("#yAveKPI_PDF_student svg");
            if (chartSvg_year) {
                chartPng_year = await svgToPng(chartSvg_year);
            }

            // Attendance Chart
            const chartSvg_att = document.querySelector("#att_PDF_student svg");
            if (chartSvg_att) {
                chartPng_att = await svgToPng(chartSvg_att);
            }

            // Create the PDF
            const pdf = new jsPDF();

            // Cover Page
            pdf.setFontSize(32);
            const title = `${selectedYear} Student Report`;
            pdf.text(title, 105, 50, { align: 'center' });

            pdf.setFontSize(18);
            const name = `${toProperCase(selectedStudent)}`;
            const nameMaxWidth = 180; // Max width for title text
            const nameLines = pdf.splitTextToSize(name, nameMaxWidth);
            pdf.text(nameLines, 105, 70, { align: 'center' });
            pdf.text(`Cohort${selectedCohort}: ${className}`, 105, 80, { align: 'center' });
            pdf.addPage();

            // Define the dimensions for the charts
            const chartWidth = 80; // Half of the original width to fit two charts in a row
            const chartHeight = 70; // Keep the original height
            const spacing = 10; // Spacing between charts

            let currentY = 30;


            // First Row: English KPIs and Squash KPIs
            if (englishStudent) {
                currentY = addChart(pdf, chartPng_eng, "English KPIs", 15, currentY, chartHeight, chartWidth, spacing);
            }
            if (squashStudent) {
                currentY = addChart(pdf, chartPng_squ, "Squash KPIs", 15 + chartWidth + spacing, currentY - chartHeight - spacing, chartHeight, chartWidth, spacing);
            }

            // Second Row: Average KPIs and Attendance
            if (englishStudent && squashStudent) {
                currentY = addChart(pdf, chartPng_ave, "Average KPIs", 15, currentY, chartHeight, chartWidth, spacing);
            }
            if (chartSvg_att) {
                currentY = addChart(pdf, chartPng_att, "Attendance", 15 + chartWidth + spacing, currentY - chartHeight - spacing, chartHeight, chartWidth, spacing);
            }

            // Third Row: Yearly KPIs
            if (chartSvg_year) {
                currentY = addChart(pdf, chartPng_year, "Yearly KPIs", 15, currentY + 10, chartHeight, chartWidth, spacing);
            }

            let header_temp = new Set();
            let header = ['Month'];
            if(Number(selectedYear) === 2022) {
                // Generate Table for 2022
                const fillWithNA = (table) => {
                    const maxColumns = Math.max(...table.map(row => row.length));
                    return table.map(row => {
                        const filledRow = Array(maxColumns).fill('NaN');
                        row.forEach((cell, index) => {
                            filledRow[index] = cell;
                        });
                        return filledRow;
                    });
                };

                const filled_data_English = fillWithNA(data_English);
                const filled_data_Squash = fillWithNA(data_Squash);

                header = headerEnglish(filled_data_English[0]);

                // Add table for English Data
                if (filled_data_English.length > 0) {
                    pdf.addPage('a4', 'landscape');
                    pdf.setFontSize(14);
                    pdf.text("English Data", 148, 30, { align: 'center' });

                    pdf.autoTable({
                        startY: 40,
                        head: [header],
                        body: filled_data_English.slice(1),
                        theme: 'plain',
                        columnStyles: header.reduce((cols, _, index) => {
                            cols[index] = { cellWidth: 'auto' };
                            return cols;
                        }, {})
                    });
                }

                // Add table for Squash Data
                if (filled_data_Squash.length > 0) {
                    pdf.addPage('a4', 'landscape');
                    pdf.setFontSize(14);
                    pdf.text("Squash Data", 148, 30, { align: 'center' });
                    header = filled_data_Squash[0];
                    pdf.autoTable({
                        startY: 40,
                        head: [header],
                        body: filled_data_Squash.slice(1),
                        theme: 'plain',
                        columnStyles: filled_data_Squash[0].reduce((cols, _, index) => {
                            cols[index] = { cellWidth: 'auto' };
                            return cols;
                        }, {})
                    });
                }
            }
            else {
                // Add table with data_English
                if (data_English.length > 0) {
                    pdf.addPage('a4', 'landscape');
                    pdf.setFontSize(14);
                    pdf.text("English Data", 148, 30, { align: 'center' });
    
                    // Prepare table data
                    const tableData = [];
    
                    for (let i = 0; i < data_English[1].length; i++) {
                        if (Object.keys(englishStudent.scores[i])[0] === 'OS') {
                            tableData.push([
                                toProperCase(englishStudent.month[i]), 
                                (Object.values(englishStudent.scores[i])[0]).toFixed(2), 
                                (Object.values(englishStudent.scores[i+1])[0]).toFixed(2),
                                (Object.values(englishStudent.scores[i+2])[0]).toFixed(2),
                                (Object.values(englishStudent.scores[i+3])[0]).toFixed(2),
                                (Object.values(englishStudent.scores[i+4])[0]).toFixed(2)
                            ]);
                        }
                    }
    
                    const scores = englishStudent.scores;
                    for (let i = 0; i < scores.length; i++) {
                        header_temp.add(Object.keys(scores[i])[0]);
                    }
                    header = headerEnglish([...header_temp]);
    
                    // Insert table
                    pdf.autoTable({
                        startY: 40,
                        head: [header], // Headers for the table
                        body: tableData,
                        theme: 'plain', // 'striped'|'grid'|'plain'|'css' available
                        columnStyles: {
                            0: { cellWidth: 'auto' },
                            1: { cellWidth: 'auto' },
                            2: { cellWidth: 'auto' },
                            3: { cellWidth: 'auto' },
                            4: { cellWidth: 'auto' },
                            5: { cellWidth: 'auto' }
                        }
                    });
                }
    
                // Add table with data_Squash
                if (data_Squash.length > 0) {
                    header_temp = new Set();
                    header = ['Month'];
                    pdf.addPage('a4', 'landscape');
                    pdf.setFontSize(14);
                    pdf.text("Squash Data", 148, 30, { align: 'center' });
                
                    // Prepare headers from squashStudent.scores
                    squashStudent.scores.forEach(score => header_temp.add(Object.keys(score)[0]));
                    header = header.concat([...header_temp]);
                
                    const tableData = [];
                    const monthData = {};
                
                    squashStudent.month.forEach((month, index) => {
                        const key = toProperCase(month);
                        if (!monthData[key]) monthData[key] = Array(header.length).fill(NaN);
                        monthData[key][0] = key;
                        const scoreKey = Object.keys(squashStudent.scores[index])[0];
                        const scoreValue = Object.values(squashStudent.scores[index])[0];
                        monthData[key][header.indexOf(scoreKey)] = scoreValue.toFixed(2);
                    });
                
                    for (let month in monthData) {
                        tableData.push(monthData[month]);
                    }
                
                    // Insert the main table
                    pdf.autoTable({
                        startY: 40,
                        head: [header], // Headers for the table
                        body: tableData,
                        theme: 'plain', // 'striped'|'grid'|'plain'|'css' available
                        pageBreak: 'auto', // Automatically manage page breaks
                        columnStyles: header.reduce((cols, _, index) => {
                            cols[index] = { cellWidth: 'auto' };
                            return cols;
                        }, {})
                    });
                }
                
            }
            
            // Get the final Y position of the main table
            const finalY = pdf.previousAutoTable.finalY;
            
            // Prepare description table data
            addSmallTable(pdf, header, finalY);

            // Add headers and footers
            addHeadersFooters(pdf, 'Student', selectedStudent);

            // Resolve the PDF output as a blob
            resolve(pdf.output('blob'));
        });
    });
}

import { generateChart_TeacherPerformacneDashboard } from "./display_attendance.js";
async function generateTeacherPdf(selectedYear, selectedCohort, selectedTeacher) {
    const fileName1 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_English_KPIs.csv`;
    const fileName2 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_Squash_KPIs.csv`;

    try {
        // Load the first dataset
        const object_data_loadfile1 = new DATA_LOADFILE();
        await object_data_loadfile1.loadNparseCSV_async(fileName1, selectedYear);
        const data1 = object_data_loadfile1.parsedData;
        const data1_objectName = object_data_loadfile1.objectData;
        const English = data1_objectName.find(student => student.teacher === selectedTeacher);

        if (English) {
            const namesArray = filterAndAddNames(data1_objectName, selectedTeacher);
            const pdfBlob = await generateChart_teacher(data1, namesArray, selectedYear, selectedTeacher, selectedCohort);
            return pdfBlob;
        } else {
            // Load the second dataset if the teacher is not found in the first dataset
            const object_data_loadfile2 = new DATA_LOADFILE();
            await object_data_loadfile2.loadNparseCSV_async(fileName2, selectedYear);
            const data2 = object_data_loadfile2.parsedData;
            const data2_objectName = object_data_loadfile2.objectData;
            const namesArray = filterAndAddNames(data2_objectName, selectedTeacher);
            const pdfBlob = await generateChart_teacher(data2, namesArray, selectedYear, selectedTeacher, selectedCohort);
            return pdfBlob;
        }
    } catch (error) {
        console.error("Error generating teacher PDF:", error);
        throw error;
    }
}

async function generateChart_teacher(data, namesArray, selectedYear, selectedTeacher, selectedCohort) {
    const { jsPDF } = window.jspdf;

    // Calculate the mean array
    const mean_array = object_array_mean_for_month.countMean_teacher(data, namesArray);
    const new_mean_array = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array));

    // Generate and convert charts to PNG
    const data_table = object_data_cleaning.makeArrayNoObject2(mean_array);

    // Function to fill NaNs with a placeholder (e.g., 'N/A')
    const fillWithNA = (table) => {
        const maxColumns = Math.max(...table.map(row => row.length));
        return table.map(row => {
            const filledRow = Array(maxColumns).fill('NaN');
            row.forEach((cell, index) => {
                filledRow[index] = cell;
            });
            return filledRow;
        });
    };

    const filled_data_table = fillWithNA(data_table);

    object_stackedbarchart_teacher.loadStackedBarChart(new_mean_array, "#KPI_PDF_teacher");
    const chartSvg_kpi = document.querySelector("#KPI_PDF_teacher svg");
    const chartPng_kpi = await svgToPng(chartSvg_kpi);

    object_linechart_teacher.loadLineChart_selectedCohort(mean_array, "#aveKPI_PDF_teacher");
    const chartSvg_ave = document.querySelector("#aveKPI_PDF_teacher svg");
    const chartPng_ave = await svgToPng(chartSvg_ave);

    // Attendance
    let chartPng_att;
    generateChart_TeacherPerformacneDashboard(selectedYear, selectedTeacher, namesArray, "#att_PDF_teacher", true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for SVG to be created
    const chartSvg_att = document.querySelector("#att_PDF_teacher svg");
    if (chartSvg_att) {
        chartPng_att = await svgToPng(chartSvg_att);
    }

    // Create the PDF
    const pdf = new jsPDF();

    // Cover Page
    pdf.setFontSize(32);
    const title = `${selectedYear} Teacher Report`;
    pdf.text(title, 105, 50, { align: 'center' });

    pdf.setFontSize(18);
    pdf.text(`${toProperCase(selectedTeacher)}`, 105, 70, { align: 'center' });
    pdf.text(`Cohort ${selectedCohort}`, 105, 80, { align: 'center' });
    pdf.addPage();

    // Define the dimensions for the charts
    const chartWidth = 80; // Half of the original width to fit two charts in a row
    const chartHeight = 70; // Keep the original height
    const spacing = 20; // Reduced spacing between the charts

    let currentY = 30;


    // Add charts to the PDF
    currentY = addChart(pdf, chartPng_kpi, "KPIs", 15, currentY, chartHeight, chartWidth, spacing);
    currentY = addChart(pdf, chartPng_ave, "Average KPIs", 15 + chartWidth + spacing, currentY - chartHeight - spacing, chartHeight, chartWidth, spacing);
    if (chartPng_att) {
        currentY = addChart(pdf, chartPng_att, "Attendance", 15, currentY, chartHeight, chartWidth, spacing);
    }

    // Add a new page for the table
    pdf.addPage('a4', 'landscape');

    // Add the main table and get the final Y position
    const finalY = addMainTable(pdf, filled_data_table);

    // Add the small table (descriptions) based on the final Y position of the main table
    addSmallTable(pdf, filled_data_table[0], finalY);

    addHeadersFooters(pdf, 'Teacher',selectedTeacher);

    return pdf.output('blob');
}


const addChart = (pdf, chartPng, title, xPosition, yPosition, chartHeight, chartWidth, spacing) => {
    if (yPosition + chartHeight + spacing > 280) { // If the chart doesn't fit on the current page
        pdf.addPage();
        yPosition = 30; // Reset the Y position for the new page
    }
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text(title, xPosition, yPosition - 5); // Title position above the chart
    pdf.addImage(chartPng, 'PNG', xPosition, yPosition, chartWidth, chartHeight);
    return yPosition + chartHeight + spacing;
};

const addHeadersFooters = (pdf, reportName, selected) => {
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`${reportName} Report - ${toProperCase(selected)}`, 10, 10);
        pdf.text(`Page ${i} of ${pageCount}`, 200, 10, { align: 'right' });
    }
};

const addMainTable = (pdf, dataTable) => {
    pdf.setFontSize(14);
    pdf.text("KPIs", 148, 30, { align: 'center' });

    // Fill NaNs with a placeholder (e.g., 'N/A')
    const fillWithNA = (table) => {
        const maxColumns = Math.max(...table.map(row => row.length));
        return table.map(row => {
            const filledRow = Array(maxColumns).fill('NaN');
            row.forEach((cell, index) => {
                filledRow[index] = cell;
            });
            return filledRow;
        });
    };

    const filledDataTable = fillWithNA(dataTable);

    // Add the table data to the new page
    pdf.autoTable({
        startY: 40, // Start position of the table
        head: [filledDataTable[0]], // Headers for the table
        body: filledDataTable.slice(1), // Data for the table
        theme: 'plain',
        columnStyles: filledDataTable[0].reduce((cols, _, index) => {
            cols[index] = { cellWidth: 'auto' };
            return cols;
        }, {})
    });

    return pdf.previousAutoTable.finalY; // Return the final Y position of the main table
};

const addSmallTable = (pdf, header, finalY) => {
    // Prepare description table data
    const headerDescriptions = {
        'R': 'Reading',
        'W': 'Writing',
        'L': 'Listening',
        'S': 'Speaking',
        'OS': 'Overall Score',
        'E': 'Endurance',
        'C': 'Coordinate',
        'S': 'Skill',
        'M': 'Movement',
        'D (FH)': 'Drive (Forehand)',
        'D (BH)': 'Drive (Backhand)',
        'S (FH)': 'Serve (Forehand)',
        'S (BH)': 'Serve (Backhand)',
        'V (FH)': 'Volley (Forehand)',
        'V (BH)': 'Volley (Backhand)',
        'CC (FH)': 'Cross Court (Forehand)',
        'CC (BH)': 'Cross Court (Backhand)',
        'RS (FH)': 'Return of Serve (Forehand)',
        'RS (BH)': 'Return of Serve (Backhand)',
        'B (FH)': 'Boast (Forehand)',
        'B (BH)': 'Boast (Backhand)'
    };

    const descriptionData = header.slice(1).map(headerKey => [headerKey, headerDescriptions[headerKey] || '']);

    // Check if the description table can fit on the current page
    const descriptionStartY = finalY + 10; // Adjust the gap between tables as needed
    const pageHeight = pdf.internal.pageSize.height;
    const rowHeight = 10; // Approximate height of each row

    if (descriptionStartY + descriptionData.length * rowHeight < pageHeight && !isNaN(finalY)) {
        // Insert description table on the same page
        pdf.autoTable({
            startY: descriptionStartY,
            head: [['Header', 'Description']],
            body: descriptionData,
            theme: 'plain',
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' }
            }
        });
    } else if(isNaN(finalY)) {
        pdf.autoTable({
            startY: 30,
            head: [['Header', 'Description']],
            body: descriptionData,
            theme: 'plain',
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' }
            }
        });
    } else {
        // Add a new page for the description table
        pdf.addPage('a4', 'landscape');

        // Insert description table at the start of the new page
        pdf.autoTable({
            startY: 20, // Adjust this value to control the starting Y position of the table
            head: [['Header', 'Description']],
            body: descriptionData,
            theme: 'plain',
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' }
            }
        });
    }
};

const headerEnglish = (headerRow) => {
    let header_temp = new Set();
    let header = ['Month'];
    const header_eng = headerRow;
    for (let i = 0; i < header_eng.length; i++) {
        header_temp.add(header_eng[i]);
    }

    header_temp = [...header_temp];
    header_temp.forEach((key) => {
        if (key === 'OS') {
            header.push('Overall Score');
        } else if (key === 'R') {
            header.push('Reading');
        } else if (key === 'W') {
            header.push('Writing');
        } else if (key === 'L') {
            header.push('Listening');
        } else if (key === 'S') {
            header.push('Speaking');
        }
    });
    return header;
}

import { loadAndGenerateGraph_for_2022_class } from "./display.js";
import { generateChart } from "./display_attendance.js";
import { generateAttChart_class } from "./display_attendance.js";
async function generateClassPdf(selectedYear, selectedCohort) {
    const { jsPDF } = window.jspdf;
    const classes = ['', 'HAPPY CUBS', 'KIND CUBS', 'STRONG CUBS'];
    const fileName1 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_English_KPIs.csv`;
    const fileName2 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_Squash_KPIs.csv`;

    // Load and parse CSV data
    await object_data_loadfile1.loadNparseCSV_async(fileName1, selectedYear);
    const data1 = object_data_loadfile1.parsedData;

    await object_data_loadfile2.loadNparseCSV_async(fileName2, selectedYear);
    const data2 = object_data_loadfile2.parsedData;

    let dataEnglish;
    let dataSquash;
    const generateChartsAndPNGs = async (className, data1, data2) => {
        const chartSelectors = {
            '': ['#engKPI_PDF_class', '#squaKPI_PDF_class', '#aveKPI_PDF_class', '#att_PDF_class'],
            'HAPPY CUBS': ['#engKPI_PDF_happy', '#squaKPI_PDF_happy', '#aveKPI_PDF_happy', '#att_PDF_happy'],
            'KIND CUBS': ['#engKPI_PDF_kind', '#squaKPI_PDF_kind', '#aveKPI_PDF_kind', '#att_PDF_kind'],
            'STRONG CUBS': ['#engKPI_PDF_strong', '#squaKPI_PDF_strong', '#aveKPI_PDF_strong', '#att_PDF_strong']
        };

        if (Number(selectedYear) === 2022 && Number(selectedCohort) === 1) {
            //(programme1, programme2, chosenYear, chosenCohort, selectedClass, id_ave, id_eng, id_squa, switch_showLable)
            const {nnew_data1, nnew_data2} = await loadAndGenerateGraph_for_2022_class(
                'English', 'Squash', selectedYear, "COHORT" + selectedCohort, className, 
                chartSelectors[className][0], chartSelectors[className][1], chartSelectors[className][2]);
            dataEnglish = object_array_mean_for_month.countMean(nnew_data1, className);
            dataSquash = object_array_mean_for_month.countMean(nnew_data2, className);
            console.log(dataEnglish);
        } else {
            const mean_array_eng = object_array_mean_for_month.countMean(data1, className);
            const mean_array_squa = object_array_mean_for_month.countMean(data2, className);
            const new_mean_array_eng = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array_eng));
            const new_mean_array_squa = object_data_cleaning.removeColumn_OS(object_data_cleaning.makeArrayNoObject2(mean_array_squa));

            object_stackedbarchart_class.loadStackedBarChart(new_mean_array_eng, chartSelectors[className][0]);
            object_stackedbarchart_class.loadStackedBarChart(new_mean_array_squa, chartSelectors[className][1]);
            object_linechart_class.loadLineChart(mean_array_eng, mean_array_squa, chartSelectors[className][2]);

            // prepare data for table
            
            dataEnglish = object_array_mean_for_month.countMean(data1, className);
            dataSquash = object_array_mean_for_month.countMean(data2, className);
        }
        if (className === '') {
            generateChart(selectedYear, chartSelectors[className][3], true);
        } else {
            generateAttChart_class(selectedYear, selectedCohort, className, chartSelectors[className][3], true);
        }

        const chartPngs = [];
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (const selector of chartSelectors[className]) {
            const chartSvg = document.querySelector(`${selector} svg`);
            const chartPng = await svgToPng(chartSvg);
            chartPngs.push(chartPng);
        }

        return chartPngs;
    };

    const pdf = new jsPDF();

    // Cover Page
    pdf.setFontSize(32);
    const title = `${selectedYear} Cohort ${selectedCohort} Report`;
    pdf.text(title, 105, 50, { align: 'center' });

    pdf.addPage();

    let filled_data_table_squa;
    for (const [index, className] of classes.entries()) {
        if (index > 0) {
            pdf.addPage('a4', 'portrait');
        }

        const chartPngs = await generateChartsAndPNGs(className, data1, data2);
        const titles = {
            '': 'Overall Cohort',
            'HAPPY CUBS': 'Happy Cubs',
            'KIND CUBS': 'Kind Cubs',
            'STRONG CUBS': 'Strong Cubs'
        };

        // Set the document title and cohort report
        pdf.setFontSize(14);
        pdf.text(`${selectedYear} Cohort ${selectedCohort} ${titles[className]} Report`, 15, 20);

        // Define the dimensions for the charts
        const chartWidth = 90; // Half of the original width to fit two charts in a row
        const chartHeight = 80; // Keep the original height
        const spacing = 5; // Reduced spacing between the charts

        // Labels for each chart
        const labels = ["English KPIs", "Squash KPIs", "Average KPIs", "Attendance"];

        // Add the charts, two on each row
        let currentY = 40;
        chartPngs.forEach((chartPng, index) => {
            const x = 15 + ((index % 2) * (chartWidth + spacing)); // Alternates between 15 and 115
            const y = currentY + (Math.floor(index / 2) * (chartHeight + spacing - 50)); // Reduced space between rows
            
            // Add title for each chart
            pdf.setFontSize(12);
            pdf.text(labels[index], x, y - 3); // Adjusted y-coordinate for title

            // Add chart image
            pdf.addImage(chartPng, 'PNG', x, y, chartWidth, chartHeight);

            if ((index % 2) === 1) {
                currentY += chartHeight + spacing + 5; // Move to the next row after two charts
            }
        });

        pdf.addPage('a4', 'landscape');

        // Prepare data tables for English and Squash KPIs

        // Function to fill NaNs with a placeholder (e.g., 'N/A')
        const fillWithNA = (table) => {
            const maxColumns = Math.max(...table.map(row => row.length));
            return table.map(row => {
                const filledRow = Array(maxColumns).fill('NaN');
                row.forEach((cell, index) => {
                    filledRow[index] = cell;
                });
                return filledRow;
            });
        };

        const data_table_eng = object_data_cleaning.makeArrayNoObject2(dataEnglish);
        const filled_data_table_eng = fillWithNA(data_table_eng);

        const data_table_squa = object_data_cleaning.makeArrayNoObject2(dataSquash);
        filled_data_table_squa = fillWithNA(data_table_squa);

        let header = headerEnglish(filled_data_table_eng[0]);

        // Add the English KPIs table
        pdf.setFontSize(14);
        pdf.text("English KPIs", 148, 20, { align: 'center' });

        pdf.autoTable({
            startY: 30,
            head: [header],
            body: filled_data_table_eng.slice(1),
            theme: 'plain',
            columnStyles: filled_data_table_eng[0].reduce((cols, _, index) => {
                cols[index] = { cellWidth: 'auto' };
                return cols;
            }, {})
        });

        // Add the Squash KPIs table
        pdf.addPage('a4', 'landscape');
        pdf.setFontSize(14);
        pdf.text("Squash KPIs", 148, 20, { align: 'center' });

        pdf.autoTable({
            startY: 30,
            head: [filled_data_table_squa[0]],
            body: filled_data_table_squa.slice(1),
            theme: 'plain',
            columnStyles: filled_data_table_squa[0].reduce((cols, _, index) => {
                cols[index] = { cellWidth: 'auto' };
                return cols;
            }, {})
        });
    }

    // Add the small description table for Squash KPIs on the last page
    pdf.addPage('a4', 'portrait');
    pdf.setFontSize(14);
    pdf.text("Squash KPI Descriptions", 40, 25, { align: 'center' });


    // Add the small table (descriptions) based on the final Y position of the main table
    addSmallTable(pdf, filled_data_table_squa[0], NaN);

    addHeadersFooters(pdf, 'Class',selectedCohort);

    return pdf.output('blob');
}




async function svgToPng(svgElement, scalingFactor = 2) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve) => {
        img.onload = function() {
            // Get the original width and height
            const width = parseInt(svgElement.getAttribute("width"));
            const height = parseInt(svgElement.getAttribute("height"));
            
            // Set the canvas width and height to the scaled size
            canvas.width = width * scalingFactor;
            canvas.height = height * scalingFactor;

            // Scale the context to match the scaling factor
            ctx.scale(scalingFactor, scalingFactor);

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Convert the canvas to a PNG data URL
            resolve(canvas.toDataURL("image/png"));
        };

        // Set the image source to the SVG data
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    });
}

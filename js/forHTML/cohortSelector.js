const first = {cohort: 1, year: 2022};

const selectCohort = document.getElementById('select-cohort');
const selectCohort_factor_analysis = document.getElementById('select-cohort_factor_analysis');
const cohortSelect_attendance = document.getElementById('cohortSelect_attendance');
const PDFselectCohort = document.getElementById('cohort');

// Function to add options to a select element
const addOptions = (selectElement, startCohort, endCohort, selectedCohort) => {
    for (let cohortNum = startCohort; cohortNum <= endCohort; cohortNum++) {
        let option = document.createElement('option');
        option.value = cohortNum;
        option.textContent = 'Cohort ' + cohortNum;
        if (cohortNum === selectedCohort) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    }
};

// Function to add a default "--Select--" option
const addDefaultOption = (selectElement) => {
    let defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "--Select--";
    defaultOption.selected = true;
    // defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);
};

// Determine cohorts based on the condition
if (minYear < first.year) {
    const difference = currentYear - first.year;
    const currentCohort = first.cohort + difference;
    addOptions(selectCohort, first.cohort, currentCohort, first.cohort);
    addOptions(selectCohort_factor_analysis, first.cohort, currentCohort, first.cohort);
    addDefaultOption(cohortSelect_attendance);
    addOptions(cohortSelect_attendance, first.cohort, currentCohort, null);
} else {
    const difference = currentYear - minYear;
    const minCohort = first.cohort + difference;
    const currentCohort = minCohort + difference;
    addOptions(selectCohort, minCohort, currentCohort, minCohort);
    addOptions(selectCohort_factor_analysis, minCohort, currentCohort, minCohort);
    addDefaultOption(cohortSelect_attendance);
    addOptions(cohortSelect_attendance, minCohort, currentCohort, null);
}


const difference = currentYear - first.year;
const currentCohort = first.cohort + difference;
addOptions(PDFselectCohort, first.cohort, currentCohort, first.cohort);

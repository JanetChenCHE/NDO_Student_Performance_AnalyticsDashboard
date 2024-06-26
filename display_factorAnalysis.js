
import { FACTORANALYSIS } from './js/d3/factorAnalysis.js';
import { DATA_LOADFILE } from './js/loadFile/data.js';
import { calculation_chosenYear_value_oneLine } from './display.js';

// object
const object_factor_analysis = new FACTORANALYSIS();
const object_data_loadfile1 = new DATA_LOADFILE();
const object_data_loadfile2 = new DATA_LOADFILE();

function getuniqKey_fromArray(data) {
    let uniqKey = new Set();
    const scores = data[0].scores;
    for(let i=0; i<scores.length; i++) {
        if(Object.keys(scores[i])[0] !== 'OS'){
            uniqKey.add(Object.keys(scores[i])[0]);
        }
    }
    return([...uniqKey]);
}

function generateCorrelogram(selectedYear, selectedCohort, programme) {

    const fileName1 = `./datasets_csv/KPI_(C${selectedCohort})_${selectedYear}_${programme}_KPIs.csv`;
    
    let point = [];
    let properties;
    object_data_loadfile1.loadNparseCSV(fileName1, selectedYear, () => {
        const data = object_data_loadfile1.objectData;
        if(programme === 'English') {
            // English
            properties = getuniqKey_fromArray(data);
            for(let i=0; i<data.length; i++) {
                const aveScore_L = calculation_chosenYear_value_oneLine(data[i], 'L');
                const aveScore_S = calculation_chosenYear_value_oneLine(data[i], 'S');
                const aveScore_W = calculation_chosenYear_value_oneLine(data[i], 'W');
                const aveScore_R = calculation_chosenYear_value_oneLine(data[i], 'R');
                point.push({Listening: aveScore_L, Speaking: aveScore_S, Writing: aveScore_W, Reading:aveScore_R});
            }
        }
        else if (programme === 'Squash') {
            // Squash
            properties = getuniqKey_fromArray(data);
            const key = ['Endurance', 'Coordinate', 'Skill', 'Movement', 'D (FH)', 'D (BH)', 'S (FH)', 'S (BH)', 'V (FH)', 'V (BH)', 'CC (FH)', 'CC (BH)', 'RS (FH)', 'RS (BH)', 'B (FH)', 'B (BH)'];

            data.forEach(item => {
                const scores = {};
                properties.forEach((prop, index) => {
                    scores[key[index]] = calculation_chosenYear_value_oneLine(item, prop);
                });
                point.push(scores);
            });
            // console.log(point);
        }
        // Generate Correlogram
        object_factor_analysis.loadCorrelogram(point, programme, properties.length);
    });
}


function updateDashboard() {
    cleanDashboard();
    const selectedYear = document.getElementById('year_att_factor_analysis').value;
    const selectedCohort = document.getElementById('select-cohort_factor_analysis').value;

    generateCorrelogram(selectedYear, selectedCohort, 'English');
    generateCorrelogram(selectedYear, selectedCohort, 'Squash');

}

function cleanDashboard() {
    object_factor_analysis.deleteChart("#correlogram_English");
    object_factor_analysis.deleteChart("#correlogram_Squash1");
    object_factor_analysis.deleteChart("#correlogram_Squash2");
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('year_att_factor_analysis').addEventListener('change', updateDashboard);
    document.getElementById('select-cohort_factor_analysis').addEventListener('change', updateDashboard);

    updateDashboard();
});
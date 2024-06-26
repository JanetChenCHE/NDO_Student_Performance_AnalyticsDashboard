class SKILLSGAPANALYSIS{
    // constructor

    //method
    card_showMeasurement(selectedYear, data_English, data_Squash) {
        let measurement_eng;
        let measurement_squ;

        for(let i=0; i<data_English.length; i++) {
            const year = data_English[i][0];
            if(year === Number(selectedYear)) {
                measurement_eng = this.measureCambridgeMeasurement(data_English[i][1]);
                measurement_squ = this.measure_short(data_Squash[i][1]);
                document.getElementById('skill_analysis_English').innerHTML = measurement_eng;
                document.getElementById('skill_analysis_Squash').innerText = measurement_squ;
            }
        }
    }

    card_showMeasurement_S(selectedYear, data_English) {
        let measurement_eng;

        for(let i=0; i<data_English.length; i++) {
            const year = data_English[i][0];
            if(year === Number(selectedYear)) {
                measurement_eng = this.measure_short(data_English[i][1]);
                document.getElementById('skill_analysis_English_S').innerHTML = measurement_eng;
            }
        }
    }
    card_showMeasurement_L(selectedYear, data_English) {
        let measurement_eng;

        for(let i=0; i<data_English.length; i++) {
            const year = data_English[i][0];
            if(year === Number(selectedYear)) {
                measurement_eng = this.measure_short(data_English[i][1]);
                document.getElementById('skill_analysis_English_L').innerHTML = measurement_eng;
            }
        }
    }
    card_showMeasurement_R(selectedYear, data_English) {
        let measurement_eng;

        for(let i=0; i<data_English.length; i++) {
            const year = data_English[i][0];
            if(year === Number(selectedYear)) {
                measurement_eng = this.measure_short(data_English[i][1]);
                document.getElementById('skill_analysis_English_R').innerHTML = measurement_eng;
            }
        }
    }
    card_showMeasurement_W(selectedYear, data_English) {
        let measurement_eng;

        for(let i=0; i<data_English.length; i++) {
            const year = data_English[i][0];
            if(year === Number(selectedYear)) {
                measurement_eng = this.measure_short(data_English[i][1]);
                document.getElementById('skill_analysis_English_W').innerHTML = measurement_eng;
            }
        }
    }

    // categorise to 2
    measure(value) {
        if(value >3) {
            return 'good';
        }
        else {
            return 'bad';
        }
    }

    // categorise to 6 - English
    measureCambridgeMeasurement(value) {
        if(value > 0 && value <= 1) {
            return '<li>Can hardly read and understand basic English words without  full guidance.</li> <br><li>Can copy words they see  and repeat the words they hear.</li>';
        }
        else if(value > 1 && value <= 2) {
            return '<li>Can read and understand simple words with visual support and full guidance.</li><br><li>Can copy words and simple phrases, as well as repeat them slowly and clearly.</li>';
        }
        else if(value > 2 && value <= 3) {
            return '<li>Can read and understand simple words and very simple phrases with visual support and some guidance.</li><br><li>Can use simple words and very simple phrases in speaking and writing using visual support and some guidance.</li>';
        }
        else if(value > 3 && value <= 4) {
            return '<li>Can read and understand simple words and very simple phrases with visual support  with little guidance.</li><br><li>Can use simple words and very simple phrases in speaking and writing using visual support and little guidance.</li>';
        }
        else if(value > 4 && value <= 5) {
            return '<li>Can read and understand simple words and very simple phrases with visual support  with no guidance.</li><br><li>Can use simple words and very simple phrases in speaking and writing using visual support and no guidance.</li>';
        }
        else if(value > 4 && value <= 5) {
            return '<li>Can read and understand simple words and very simple phrases confidently and independently.</li><br><li>Can use simple words and very simple phrases in speaking and writing confidently and independently.</li><br><li>Shows a good example of language use to othrers.</li>';
        }
    }

    measure_short(value) {
        if(value > 0 && value <= 1) {
            return 'Very Poor';
        }
        else if(value > 1 && value <= 2) {
            return 'Somewhat Poor';
        }
        else if(value > 2 && value <= 3) {
            return 'Little Difficulty';
        }
        else if(value > 3 && value <= 4) {
            return 'Manageable';
        }
        else if(value > 4 && value <= 5) {
            return 'Good';
        }
        else if(value > 4 && value <= 5) {
            return 'Very Good';
        }
    }
}

export { SKILLSGAPANALYSIS };
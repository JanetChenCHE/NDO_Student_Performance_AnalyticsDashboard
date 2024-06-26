class COHORTYEAR {
    // constructor

    //method
    cohort_startyear_endyear(cohort) {
        const first_cohort = 1;
        const first_year = 2022;

        const cohort_num = parseInt(cohort.replace("COHORT", ""));

        const yearDiff = cohort_num - first_cohort;

        const cohort_start_year = first_year + yearDiff;
        const cohort_end_year = cohort_start_year + 4;

        return { start: cohort_start_year, end: cohort_end_year };
    }

    fiveYear_cohort (year) {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth()) + 1;

        const first_year = 2022;

        const min_fiveYear = year - 4;

        const minCohort = min_fiveYear - first_year + 1;
        const currentCohort = year - first_year + 1;

        if(minCohort >= 1 && currentCohort >= 1) {
            return {min: minCohort, current: currentCohort};
        }
        else if(minCohort < 1 && currentCohort >= 1) {
            return {min: 1, current: currentCohort};
        } 
        else {
            return {min: 1, current: 1};
        }
    }


}

export { COHORTYEAR };
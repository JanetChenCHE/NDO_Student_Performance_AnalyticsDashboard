import { getYearlyArray } from "../../display.js";
import { CORRELATION } from "./correlation.js";

const object_correlation = new CORRELATION();
class SKILLSGAPANALYSIS1 {

    sum(yearlyArray_object, engORsqu_object) {
        let value = 0;
        let count = 0;
        const array = yearlyArray_object[engORsqu_object];
        // (let i=0; i<array.length; i++)
        // (let i = array.length - 1; i >= 0; i--) 
        for (let i = array.length - 1; i >= 0; i--) {
            // console.log(array[i]);
            if (isNaN(array[i][1])) {
                // Remove the array containing NaN
                array.splice(i, 1);
            }
        }
        // console.log(array);
        return array;
    }
    
    //getYearlyArray(selectedStudent, cohort, object)
    test(selectedStudent, cohort) {
        // English
        const R_yearlyArray = getYearlyArray(selectedStudent, cohort, 'R');
        const W_yearlyArray = getYearlyArray(selectedStudent, cohort, 'W');
        const L_yearlyArray = getYearlyArray(selectedStudent, cohort, 'L');
        // English & Squash
        const S_yearlyArray = getYearlyArray(selectedStudent, cohort, 'S');
        // Squash
        
        const E_yearlyArray = getYearlyArray(selectedStudent, cohort, 'E');
        const C_yearlyArray = getYearlyArray(selectedStudent, cohort, 'C');
        const M_yearlyArray = getYearlyArray(selectedStudent, cohort, 'M');
        const D_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'D (FH)');
        const D_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'D (BH)');
        const S_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'S (FH)');
        const S_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'S (BH)');
        const V_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'V (FH)');
        const V_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'V (BH)');
        const CC_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'CC (FH)');
        const CC_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'CC (BH)');
        const RS_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'RS (FH)');
        const RS_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'RS (BH)');
        const B_FH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'B (FH)');
        const B_BH_yearlyArray = getYearlyArray(selectedStudent, cohort, 'B (BH)');
        console.log(RS_BH_yearlyArray);
    }

    test2(selectedStudent, cohort, engORsqu_object1, object1, engORsqu_object2, object2) {
        const yearlyArray_object1 = getYearlyArray(selectedStudent, cohort, object1);
        const yearlyArray_object2 = getYearlyArray(selectedStudent, cohort, object2);
        const sum_object1 = this.sum(yearlyArray_object1, engORsqu_object1);
        const sum_object2 = this.sum(yearlyArray_object2, engORsqu_object2);
        const correlation = object_correlation.calculateCorrelation_forSameLengthArray(sum_object1, sum_object2);

        return correlation;
    }

    // display() {
    //     document.getElementById('EnglishCorrelation').innerHTML = 
    //     `<table>
    //     <tr>
    //         <td>
    //             English Measurement
    //         </td>
    //         <td>
    //             Speaking(S)
    //         </td>
    //         <td>
    //             Listening(L)
    //         </td>
    //         <td>
    //             Reading(R)
    //         </td>
    //         <td>
    //             Writing(W)
    //         </td>
    //     </tr>
    //     <tr>
    //         <td>
    //             Speaking(S)
    //         </td>
    //         <td>

    //         </td>
    //     </tr>
    //     <tr>
    //         <td>
    //             Listening(L)
    //         </td>
    //         <td>
            
    //         </td>
    //     </tr>
    //     <tr>
    //         <td>
    //             Reading(R)
    //         </td>
    //         <td>
            
    //         </td>
    //     </tr>
    //     <tr>
    //         <td>
    //             Writing(W)
    //         </td>
    //         <td>
            
    //         </td>
    //     </tr>
    // </table>`;
    // }
}

export { SKILLSGAPANALYSIS1 };
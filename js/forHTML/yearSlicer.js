const currentYear = new Date().getFullYear();
const currentMonth = (new Date().getMonth()) + 1;

const firstYear = 2022; 
const minYear = currentYear - 4; 

// Set the attributes of the range input
if(minYear<firstYear) {
    document.getElementById("year_student_line").setAttribute("min", firstYear);
    document.getElementById("year_student_line").setAttribute("max", currentYear);
    document.getElementById("year_student_line").setAttribute("value", currentYear);
    document.getElementById("year_student_line_value").innerText = currentYear;
    
    document.getElementById("year_class").setAttribute("min", firstYear);
    document.getElementById("year_class").setAttribute("max", currentYear);
    document.getElementById("year_class").setAttribute("value", currentYear);
    document.getElementById("year_class_value").innerText = currentYear;
    
    document.getElementById("year_teacher").setAttribute("min", firstYear);
    document.getElementById("year_teacher").setAttribute("max", currentYear);
    document.getElementById("year_teacher").setAttribute("value", currentYear);
    document.getElementById("year_teacher_value").innerText = currentYear;
    
    document.getElementById("year_att_gender").setAttribute("min", firstYear);
    document.getElementById("year_att_gender").setAttribute("max", currentYear);
    document.getElementById("year_att_gender").setAttribute("value", currentYear);
    document.getElementById("year_att_gender_value").innerText = currentYear;

    const selectYear = document.getElementById('select-year');
    for (let year = firstYear; year <= currentYear; year++) {
        let option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        selectYear.appendChild(option);
    }
    
    document.getElementById("year_att_factor_analysis").setAttribute("min", firstYear);
    document.getElementById("year_att_factor_analysis").setAttribute("max", currentYear);
    document.getElementById("year_att_factor_analysis").setAttribute("value", currentYear);
    document.getElementById("year_att_factor_analysis_value").innerText = currentYear;
}
else {
    document.getElementById("year_student_line").setAttribute("min", minYear);
    document.getElementById("year_student_line").setAttribute("max", currentYear);
    document.getElementById("year_student_line").setAttribute("value", currentYear);
    document.getElementById("year_student_line_value").innerText = currentYear;
    
    document.getElementById("year_class").setAttribute("min", minYear);
    document.getElementById("year_class").setAttribute("max", currentYear);
    document.getElementById("year_class").setAttribute("value", currentYear);
    document.getElementById("year_class_value").innerText = currentYear;
    
    document.getElementById("year_teacher").setAttribute("min", minYear);
    document.getElementById("year_teacher").setAttribute("max", currentYear);
    document.getElementById("year_teacher").setAttribute("value", currentYear);
    document.getElementById("year_teacher_value").innerText = currentYear;
    
    document.getElementById("year_att_gender").setAttribute("min", minYear);
    document.getElementById("year_att_gender").setAttribute("max", currentYear);
    document.getElementById("year_att_gender").setAttribute("value", currentYear);
    document.getElementById("year_att_gender_value").innerText = currentYear;

    const selectYear = document.getElementById('select-year');
    for (let year = minYear; year <= currentYear; year++) {
        let option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        selectYear.appendChild(option);
    }
    
    document.getElementById("year_att_factor_analysis").setAttribute("min", minYear);
    document.getElementById("year_att_factor_analysis").setAttribute("max", currentYear);
    document.getElementById("year_att_factor_analysis").setAttribute("value", currentYear);
    document.getElementById("year_att_factor_analysis_value").innerText = currentYear;
}

class DropDownMenu {
    //constructor
    
    //method
    toProperCase(str) {
        return str.toLowerCase().replace(/(?:^|\s|\/)\w/g, (match) => {
            return match.toUpperCase();
        });
    }

    populateSelection(id, data, valueChoice) {
        const selectElement = document.getElementById(id);
    
        // Clear existing options
        selectElement.innerHTML = '';
    
        // Add the "Select" option
        const selectOption = document.createElement('option');
        selectOption.text = '--Select--';
        selectOption.value = '';
        selectElement.appendChild(selectOption);
        
        // Extract unique values, filter out "-", and sort them alphabetically
        const uniqueValues = [...new Set(data.map(item => item[valueChoice]))]
            // .filter(value => value !== "-" && !value.includes('/'))
            .sort();
    
        // Add sorted options to the dropdown
        //
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.text = this.toProperCase(value);
            option.value = value;
            selectElement.appendChild(option);
        });
    }
    
}

export {DropDownMenu}

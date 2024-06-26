class DropDownMenu_array {
    // Constructor
    constructor(id, array) {
        this.id = id;
        this.array = array;
    }

    // Method to populate the dropdown
    populateSelection(defaultValue = null) {
        const selectElement = document.getElementById(this.id);

        // Clear existing options
        selectElement.innerHTML = '';

        // Add the "Select" option
        const selectOption = document.createElement('option');
        selectOption.text = '--Select--';
        selectOption.value = '';
        selectElement.appendChild(selectOption);

        // Extract unique values, filter out "-", and sort them alphabetically
        const uniqueValues = [...new Set(this.array)]
            .filter(value => value !== "-" && !value.includes('/'))
            .sort();

        console.log(uniqueValues);

        // Add sorted options to the dropdown
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.text = value;
            option.value = value;
            selectElement.appendChild(option);
        });

        // Set the default value if provided and exists in the unique values
        if (defaultValue && uniqueValues.includes(defaultValue)) {
            selectElement.value = defaultValue;
        } else {
            // If no default value provided or it does not exist, select the "Select" option
            selectElement.value = '';
        }
    }
}

export { DropDownMenu_array }

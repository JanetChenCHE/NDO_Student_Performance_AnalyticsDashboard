// Create the first table for English Measurements
let table1 = document.createElement('table');
table1.innerHTML = `
    <caption>English Measurements</caption>
    <tr>
        <td>R - Reading</td>
        <td>W - Writing</td>
        <td>L - Listening</td>
        <td>S - Speaking</td>
    </tr>
`;

// Create the second table for Squash Measurements
let table2 = document.createElement('table');
table2.innerHTML = `
    <caption>Squash Measurements</caption>
    <tr>
        <td>E - Endurance</td>
        <td>C - Coordinate</td>
        <td>S - Skill</td>
        <td>M - Movement</td>
    </tr>
`;

// Create the nested table for Squash Measurements details
let nestedTable = document.createElement('table');
nestedTable.innerHTML = `
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
`;

// Append tables to respective div containers using document.getElementById
document.addEventListener('DOMContentLoaded', function() {
    // Student Performance Dashboard
    let divTable1 = document.getElementById('table1');
    divTable1.appendChild(table1);

    let divTable2_1 = document.getElementById('table2_1');
    divTable2_1.appendChild(table2);

    let divTable2_2 = document.getElementById('table2_2');
    divTable2_2.appendChild(nestedTable);

    // Class Performance Dashboard
    let divTable1_class = document.getElementById('table1_class');
    divTable1_class.appendChild(table1);

    let divTable2_1_class = document.getElementById('table2_1_class');
    divTable2_1_class.appendChild(table2);

    let divTable2_2_class = document.getElementById('table2_2_class');
    divTable2_2_class.appendChild(nestedTable);
});

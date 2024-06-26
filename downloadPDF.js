// function downloadPDF() {
//     const element = document.getElementById('dashboard');
    
//     // Generate PDF from HTML content using a library like jsPDF
//     html2pdf(element, {
//         margin:       1,
//         filename:     'dashboard.pdf',
//         image:        { type: 'jpeg', quality: 0.98 },
//         html2canvas:  { scale: 2 },
//         jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//     });
// }

// // Event listener for the download button
// document.getElementById('download-pdf').addEventListener('click', downloadPDF);

// Function to download PDF
function downloadPDF() {
    const element = document.getElementById('studentperformPage');
    
    // Generate PDF from HTML content using html2pdf
    html2pdf().from(element).save('dashboard.pdf');
}

// Event listener for the download button
document.getElementById('download-pdf').addEventListener('click', downloadPDF);
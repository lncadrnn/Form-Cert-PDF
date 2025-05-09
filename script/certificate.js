// JavaScript for Warranty Certificate Generation

document.addEventListener('DOMContentLoaded', function() {
    const storedData = localStorage.getItem('certificateData');
    if (storedData) {
        const formData = JSON.parse(storedData);
        populateCertificate(formData);
        // Optional: Clear the data from localStorage after use
        // localStorage.removeItem('certificateData'); 
    } else {
        console.error('Certificate data not found in localStorage.');
        // Optionally, display a message to the user or redirect
    }
});

// This function will be called by your form's JavaScript (script.js)
// when the "Generate Certificate" button is clicked.
// It will receive the form data as an object.
function populateCertificate(formData) {
    console.log("Populating certificate with data:", formData);

    // Populate header info
    document.getElementById('certificateDate').textContent = formData.formDate || 'DATE'; // Changed from formData.date

    // Populate recipient info
    document.getElementById('recipientCompanyName').textContent = formData.companyName || 'COMPANY NAME';
    document.getElementById('recipientCompanyAddress').textContent = formData.companyAddress || 'ADDRESS OF THE COMPANY';

    // Populate reference info
    document.getElementById('purchaseOrderNumberRef').textContent = formData.purchasedNumber || 'PURCHASED NUMBER'; // Changed from formData.purchaseOrderNumber
    document.getElementById('salesOrderNumberRef').textContent = formData.soNumber || 'SO NUMBER'; // Changed from formData.salesOrderNumber
    document.getElementById('warrantyRecipientCompanyName').textContent = formData.companyName || 'COMPANY NAME'; // Assuming same as recipient

    // Populate products table
    const tableBody = document.getElementById('certificateProductsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing example rows

    if (formData.products && formData.products.length > 0) {
        formData.products.forEach((product, index) => {
            const newRow = tableBody.insertRow();
            newRow.insertCell().textContent = product.slNo || (index + 1); // Changed from product.number to product.slNo to match script.js
            newRow.insertCell().textContent = product.description || 'N/A';
            newRow.insertCell().textContent = product.qty || 'N/A'; // Changed from product.quantity
            newRow.insertCell().textContent = product.serialNos || 'N/A'; // Changed from product.serialNumbers
            newRow.insertCell().textContent = product.warranty || 'N/A';
        });
    } else {
        // Add a placeholder row if no products
        const newRow = tableBody.insertRow();
        const cell = newRow.insertCell();
        cell.colSpan = 5;
        cell.textContent = 'No products listed.';
        cell.style.textAlign = 'center';
    }

    // Signature details are static in this example, but could also be dynamic
    // Footer details are static

    // After populating, you might want to trigger a print dialog
    // window.print();
}

// Download PDF button logic moved from certificate.html

document.getElementById('downloadPdfBtn').onclick = function() {
    // Hide the download button for PDF
    const pdfHideEls = document.querySelectorAll('.pdf-hide');
    pdfHideEls.forEach(el => el.style.display = 'none');
    
    // Get the certificate content container for PDF generation
    const element = document.getElementById('pdf-certificate-content');
    const certificateContainer = document.querySelector('.certificate-container');
    
    // Store original styles to restore later
    const originalPadding = certificateContainer.style.padding;
    const originalBorder = certificateContainer.style.border;
    const originalWidth = certificateContainer.style.width;
    const originalMinHeight = certificateContainer.style.minHeight;
    
    // Optimize for PDF output - remove borders and adjust padding
    certificateContainer.style.border = 'none';
    certificateContainer.style.outline = 'none';
    certificateContainer.style.boxShadow = 'none';
    certificateContainer.style.padding = '5mm';
    certificateContainer.style.width = '200mm'; // Slightly smaller to prevent overflow
    certificateContainer.style.minHeight = 'auto'; // Let content determine height
    
    const opt = {
        margin: [10, 10, 10, 10], // Top, right, bottom, left - adding 10mm margins all around
        filename: 'warranty-certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            backgroundColor: '#fff',
            useCORS: true,
            logging: false,
            // Explicitly handle styles and elements in the cloned document
            onclone: function(doc) {
                const containerClone = doc.querySelector('.certificate-container');
                const contentClone = doc.getElementById('pdf-certificate-content');
                
                if (containerClone) {
                    // Apply all necessary style resets
                    containerClone.style.margin = '0';
                    containerClone.style.border = 'none';
                    containerClone.style.boxShadow = 'none';
                    containerClone.style.outline = 'none';
                    containerClone.style.padding = '12mm'; // Increased padding for better appearance
                    containerClone.style.width = '190mm'; // Adjusted width to accommodate margins
                    containerClone.style.minHeight = 'auto';
                    
                    // Compress vertical spacing if needed
                    const tableSections = containerClone.querySelectorAll('.products-table-section');
                    tableSections.forEach(section => {
                        section.style.marginBottom = '15px';
                    });
                    
                    const signatures = containerClone.querySelectorAll('.signatures-section');
                    signatures.forEach(sig => {
                        sig.style.marginTop = '15px';
                        sig.style.marginBottom = '15px';
                    });
                }
                
                // Remove any borders that might create extra space
                doc.querySelectorAll('*').forEach(el => {
                    if (el.tagName !== 'TABLE' && 
                        el.tagName !== 'TD' && 
                        el.tagName !== 'TH' &&
                        !el.classList.contains('cert-footer')) {
                        el.style.border = 'none';
                    }
                });
            }
        },
        jsPDF: { 
            unit: 'mm', 
            format: [216, 330], // Short bond paper dimensions
            orientation: 'portrait',
            compress: true,
            precision: 16
        }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore original styles
        certificateContainer.style.padding = originalPadding;
        certificateContainer.style.border = originalBorder;
        certificateContainer.style.width = originalWidth;
        certificateContainer.style.minHeight = originalMinHeight;
        
        // Show the button again after PDF is generated
        pdfHideEls.forEach(el => el.style.display = '');
    });
};

// Example of how script.js might call this:
// In script.js, after collecting formData:
// const certificateWindow = window.open('certificate.html', '_blank');
// certificateWindow.onload = () => {
//     certificateWindow.populateCertificate(formData);
// };
// OR if certificate.html is part of the main page (e.g. a hidden div):
// populateCertificate(formData);
// document.getElementById('certificateDisplayArea').style.display = 'block';

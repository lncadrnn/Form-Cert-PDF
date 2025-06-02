// Multi-step form navigation
let currentStep = 1;
const totalSteps = 3;

function showStep(step) {
    console.log('Showing step:', step);
    
    // Hide all form sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show current step
    const currentSection = document.querySelector(`.form-section[data-step="${step}"]`);
    if (currentSection) {
        currentSection.classList.add('active');
        console.log('Activated section:', currentSection);
    } else {
        console.error('Could not find section for step:', step);
    }
    
    // Update progress indicator
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.remove('active', 'completed');
        if (index + 1 < step) {
            progressStep.classList.add('completed');
        } else if (index + 1 === step) {
            progressStep.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    if (prevBtn) {
        prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    }
    
    if (step < totalSteps) {
        if (nextBtn) {
            nextBtn.style.display = 'inline-flex';
        }
        if (generateBtn) {
            generateBtn.style.display = 'none';
        }
    } else {
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        if (generateBtn) {
            generateBtn.style.display = 'inline-flex';
        }
    }
}

function nextStep() {
    console.log('Next step clicked, current step:', currentStep);
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    console.log('Previous step clicked, current step:', currentStep);
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateCurrentStep() {
    console.log('Validating step:', currentStep);
    
    if (currentStep === 1) {
        // Validate company information
        const companyName = document.getElementById('companyName')?.value.trim();
        const companyAddress = document.getElementById('companyAddress')?.value.trim();
        
        if (!companyName) {
            showToast('Please enter company name', 'error');
            return false;
        }
        if (!companyAddress) {
            showToast('Please enter company address', 'error');
            return false;
        }
    } else if (currentStep === 2) {
        // Validate order details
        const purchasedNumber = document.getElementById('purchasedNumber')?.value.trim();
        const soNumber = document.getElementById('soNumber')?.value.trim();
        const formDate = document.getElementById('formDate')?.value.trim();
        
        if (!purchasedNumber) {
            showToast('Please enter Purchase Order Number', 'error');
            return false;
        }
        if (!soNumber) {
            showToast('Please enter Sales Order Number', 'error');
            return false;
        }
        if (!formDate) {
            showToast('Please select a date', 'error');
            return false;
        }
    }
    
    console.log('Step validation passed');
    return true;
}

function showToast(message, type = 'error') {
    console.log('Showing toast:', message, type);
    if (window.showCustomToast) {
        window.showCustomToast(message, type);
    } else {
        alert(message);
    }
}

function submitForm() {
    console.log('Submit form called');
    
    const companyName = document.getElementById('companyName')?.value.trim();
    const companyAddress = document.getElementById('companyAddress')?.value.trim();
    const soNumber = document.getElementById('soNumber')?.value.trim();
    const purchasedNumber = document.getElementById('purchasedNumber')?.value.trim();
    const formDate = document.getElementById('formDate')?.value.trim();

    if (!companyName || !companyAddress || !soNumber || !purchasedNumber || !formDate) {
        showToast('Please fill in all company and order details.', 'error');
        return;
    }

    const productRows = document.getElementById('productTableBody')?.rows;
    if (!productRows || productRows.length === 0) {
        showToast('Please add at least one product.', 'error');
        return;
    }

    const products = [];
    for (let i = 0; i < productRows.length; i++) {
        const row = productRows[i];
        const description = row.cells[1]?.querySelector('textarea')?.value.trim();
        const qty = row.cells[2]?.querySelector('input')?.value.trim();
        const serialNos = row.cells[3]?.querySelector('textarea')?.value.trim();
        const warranty = row.cells[4]?.querySelector('textarea')?.value.trim();

        if (!description || !qty || parseInt(qty) <= 0 || !serialNos || !warranty) {
            showToast(`Please fill in all details for Product #${i + 1}.`, 'error');
            return;
        }
        products.push({
            slNo: row.cells[0]?.innerText || '',
            description: description,
            qty: qty,
            serialNos: serialNos,
            warranty: warranty
        });
    }

    const formData = {
        companyName: companyName,
        companyAddress: companyAddress,
        soNumber: soNumber,
        purchasedNumber: purchasedNumber,
        formDate: formDate,
        preparedByName: 'RHEA AGUILAR',
        preparedByTitle: 'Technical Sales Engineer',
        approvedByName: 'RICHARD FELIX DELA CRUZ',
        approvedByTitle: 'VP Operations and I.T.P',
        products: products
    };
    
    console.log('Form data:', formData);
    
    showToast('Generating certificate...', 'success');
    setTimeout(function() {
        localStorage.setItem('certificateData', JSON.stringify(formData));
        const certificateWindow = window.open('certificate/certificate.html', '_blank');
        if (!certificateWindow) {
            showToast('Please allow popups for this site', 'error');
        }
    }, 800);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Starting form initialization');
    
    // Set current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formDateInput = document.getElementById('formDate');
    if (formDateInput) {
        formDateInput.value = `${year}-${month}-${day}`;
        console.log('Date set to:', formDateInput.value);
    }

    // Add Product Button
    const addProductButton = document.getElementById('addProductBtn');
    if (addProductButton) {
        console.log('Add product button found');
        addProductButton.addEventListener('click', function () {
            console.log('Add product clicked');
            const tableBody = document.getElementById('productTableBody');
            if (!tableBody) {
                console.error('Product table body not found');
                return;
            }

            const newRow = tableBody.insertRow();
            const rowCount = tableBody.rows.length;

            // Cell for Row Number (#)
            const cell1 = newRow.insertCell(0);
            cell1.innerHTML = `<span>${rowCount}</span>`;

            // Cell for Product Description
            const cell2 = newRow.insertCell(1);
            cell2.innerHTML = '<textarea name="productDesc[]" class="product-input product-detail-textarea" rows="2" placeholder="Enter product description"></textarea>';

            // Cell for Quantity
            const cell3 = newRow.insertCell(2);
            cell3.innerHTML = '<input type="number" name="qty[]" class="qty-input" value="1" min="1">';

            // Cell for Serial Nos.
            const cell4 = newRow.insertCell(3);
            cell4.innerHTML = '<textarea name="serialNos[]" class="serial-input product-detail-textarea" rows="2" placeholder="Enter serial numbers"></textarea>';

            // Cell for Warranty
            const cell5 = newRow.insertCell(4);
            cell5.innerHTML = '<textarea name="warranty[]" class="warranty-input product-detail-textarea" rows="2" placeholder="Enter warranty details"></textarea>';

            // Cell for Action (Remove Button)
            const cell6 = newRow.insertCell(5);
            cell6.innerHTML = '<button type="button" class="removeProductBtn btn-danger">Remove</button>';
            
            console.log('Product row added');
        });
    } else {
        console.error('Add product button not found');
    }

    // Remove Product Button Event (Event Delegation)
    const productTableBody = document.getElementById('productTableBody');
    if (productTableBody) {
        productTableBody.addEventListener('click', function (e) {
            if (e.target && e.target.classList.contains('removeProductBtn')) {
                console.log('Remove product clicked');
                const rowToRemove = e.target.closest('tr');
                if (rowToRemove) {
                    rowToRemove.parentNode.removeChild(rowToRemove);
                    // Re-number all remaining rows
                    const remainingRows = productTableBody.rows;
                    for (let i = 0; i < remainingRows.length; i++) {
                        remainingRows[i].cells[0].innerHTML = `<span>${i + 1}</span>`;
                    }
                    console.log('Product row removed');
                }
            }
        });
    }

    // Add event listeners for navigation buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        console.log('Next button found, adding event listener');
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextStep();
        });
    } else {
        console.error('Next button not found');
    }
    
    if (prevBtn) {
        console.log('Previous button found, adding event listener');
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevStep();
        });
    } else {
        console.error('Previous button not found');
    }
    
    // Initialize the form to show step 1
    console.log('Initializing form with step 1');
    showStep(1);
});

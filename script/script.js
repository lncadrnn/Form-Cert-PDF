let productCounter = 0;

function addProductRow() {
    productCounter++;
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${productCounter}</td>
        <td><input type="text" name="productDescription${productCounter}" style="width: 90%;"></td>
        <td><input type="number" name="quantity${productCounter}" min="1" value="1" style="width: 70px;"></td>
        <td><textarea name="serialNumbers${productCounter}" rows="2" style="width: 90%;"></textarea></td>
        <td><textarea name="warranty${productCounter}" rows="2" style="width: 90%;"></textarea></td>
        <td><button type="button" class="remove-row-btn" onclick="removeProductRow(this)">Remove</button></td>
    `;
}

function removeProductRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    // Optional: re-number products if needed
    // updateProductNumbers();
}

// function updateProductNumbers() {
//     const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
//     const rows = tableBody.getElementsByTagName('tr');
//     for (let i = 0; i < rows.length; i++) {
//         rows[i].getElementsByTagName('td')[0].innerText = i + 1;
//         // Update input names if necessary, though not strictly required if server handles dynamic fields
//     }
//     productCounter = rows.length;
// }

let notyf;
document.addEventListener('DOMContentLoaded', function () {
    // Set current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();
    const formDateInput = document.getElementById('formDate');
    if (formDateInput) {
        formDateInput.value = month + '/' + day + '/' + year;
    }

    const addProductButton = document.getElementById('addProductBtn');
    if (addProductButton) {
        addProductButton.addEventListener('click', function () {
            const tableBody = document.getElementById('productTableBody');
            if (!tableBody) return;

            const newRow = tableBody.insertRow(); // Inserts at the end
            const rowCount = tableBody.rows.length; // Get the new total number of rows

            // Cell for Row Number (#)
            const cell1 = newRow.insertCell(0);
            cell1.innerHTML = `<span>${rowCount}</span>`;

            // Cell for Product Description
            const cell2 = newRow.insertCell(1);
            cell2.innerHTML = '<textarea name="productDesc[]" class="product-input product-detail-textarea" rows="2"></textarea>';

            // Cell for Quantity
            const cell3 = newRow.insertCell(2);
            cell3.innerHTML = '<input type="number" name="qty[]" class="qty-input" value="1" min="1">';

            // Cell for Serial Nos.
            const cell4 = newRow.insertCell(3);
            cell4.innerHTML = '<textarea name="serialNos[]" class="serial-input product-detail-textarea" rows="2"></textarea>';

            // Cell for Warranty
            const cell5 = newRow.insertCell(4);
            cell5.innerHTML = '<textarea name="warranty[]" class="warranty-input product-detail-textarea" rows="2"></textarea>';

            // Cell for Action (Remove Button)
            const cell6 = newRow.insertCell(5);
            cell6.innerHTML = '<button type="button" class="removeProductBtn">Remove</button>';
        });
    }

    const productTableBody = document.getElementById('productTableBody');
    if (productTableBody) {
        productTableBody.addEventListener('click', function (e) {
            if (e.target && e.target.classList.contains('removeProductBtn')) {
                const rowToRemove = e.target.closest('tr');
                if (rowToRemove) {
                    rowToRemove.parentNode.removeChild(rowToRemove);
                    // Re-number all remaining rows
                    const remainingRows = productTableBody.rows;
                    for (let i = 0; i < remainingRows.length; i++) {
                        remainingRows[i].cells[0].innerHTML = `<span>${i + 1}</span>`;
                    }
                }
            }
        });
    }

    if (window.Notyf && !notyf) {
        notyf = new Notyf({
            duration: 3000,
            position: { x: 'center', y: 'bottom' } // Centered at the bottom
        });
    }
});

function showToast(message, type = 'error') {
    if (window.showCustomToast) {
        window.showCustomToast(message, type);
    } else {
        alert(message);
    }
}

function submitForm() {
    const companyName = document.getElementById('companyName')?.value.trim();
    const companyAddress = document.getElementById('companyAddress')?.value.trim();
    const soNumber = document.getElementById('soNumber')?.value.trim();
    const purchasedNumber = document.getElementById('purchasedNumber')?.value.trim();
    const formDate = document.getElementById('formDate')?.value.trim(); // Date is auto-filled, but check anyway

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
        preparedByName: 'RHEA AGUILAR', // Defaulted as per previous structure
        preparedByTitle: 'Technical Sales Engineer',
        approvedByName: 'RICHARD FELIX DELA CRUZ',
        approvedByTitle: 'VP Operations and I.T.P',
        products: products
    };

    showToast('Redirecting...', 'success');
    setTimeout(function() {
        localStorage.setItem('certificateData', JSON.stringify(formData));
        const certificateWindow = window.open('certificate.html', '_blank');
        if (certificateWindow) {
            certificateWindow.onload = function() {
                // Optional: you could try to call populateCertificate directly if same-origin rules allow,
                // but localStorage method is generally more robust for new tabs.
                // if (typeof certificateWindow.populateCertificate === 'function') {
                //     certificateWindow.populateCertificate(formData);
                // }
            };
        }
    }, 1200);
}

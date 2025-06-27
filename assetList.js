const url= base_url;
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const categoryInput = document.querySelector('.category-select');
    const departmentInput = document.querySelector('.department-select');
    const cancelButton = document.querySelector('.cancel-btn');

    searchInput.addEventListener('input', filterAssets);
    categoryInput.addEventListener('change', filterAssets);
    departmentInput.addEventListener('change', filterAssets);
    cancelButton.addEventListener('click', clearFilters);
});

function filterAssets() {
    const searchValue = document.querySelector('.search-input').value.toLowerCase().trim();
    const categorySelect = document.querySelector('.category-select');
    const departmentSelect = document.querySelector('.department-select');

    const selectedCategoryName = categorySelect.selectedIndex > 0 ? categorySelect.options[categorySelect.selectedIndex].text.trim().toLowerCase() : "";
    const selectedDepartmentName = departmentSelect.selectedIndex > 0 ? departmentSelect.options[departmentSelect.selectedIndex].text.trim().toLowerCase() : "";
    const rows = document.querySelectorAll('#assets tr');

    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        const categoryCell = row.querySelector('td:nth-child(4)');
        const departmentCell = row.querySelector('td:nth-child(3)');

        if (!nameCell || !categoryCell || !departmentCell) return;

        const name = nameCell.textContent.toLowerCase().trim();
        const categoryName = categoryCell.textContent.toLowerCase().trim();
        const departmentName = departmentCell.textContent.toLowerCase().trim();

        const nameMatch = searchValue === "" || name.includes(searchValue);
        const categoryMatch = selectedCategoryName === "" || categoryName === selectedCategoryName;
        const departmentMatch = selectedDepartmentName === "" || departmentName === selectedDepartmentName;

        row.style.display = nameMatch && categoryMatch && departmentMatch ? '' : 'none';
    });
}

function clearFilters() {
    document.querySelector('.search-input').value = "";
    document.querySelector('.category-select').selectedIndex = 0;
    document.querySelector('.department-select').selectedIndex = 0;
    filterAssets();
}

async function fetchAssets() {
    try {
        const response = await fetch(url+'getAssets.php');
        const assets = await response.json();
        populateTable(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
    }
}
  
function populateTable(assets) {
    const tableBody = document.getElementById('assets');
    tableBody.innerHTML = '';

    assets.forEach(asset => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asset.asset_name}</td>
            <td>${asset.asset_brand}</td>
            <td>${asset.department}</td>
            <td>${asset.asset_category}</td>
            <td>${asset.asset_type}</td>
            <td>${asset.purchase_date}</td>
            <td>$${asset.price}</td>
            <td>${asset.asset_location}</td>
            <td>${asset.room}</td>
            <td>${asset.asset_status}</td>
            <td>${asset.bar_code}</td>
            <td>${asset.asset_condition}</td>
            <td>${asset.serial_number}</td>
            <td>${asset.description}</td>
            <td>${asset.expected_life}</td>
            <td>${asset.warranty}</td>
        `;

        row.addEventListener('click', () => openEditForm(asset));
        tableBody.appendChild(row);
    });
}

function openEditForm(asset = null) {
    const form = document.getElementById('assetForm');
    document.getElementById('id').value= asset.id;
    document.getElementById('name').value= asset.asset_name;
    document.getElementById('department').value= asset.department_id,
    document.getElementById('category').value= asset.category_id,
    document.getElementById('type').value= asset.type_id,
    document.getElementById('purchase_date').value= asset.purchase_date,
    document.getElementById('price').value= asset.price,
    document.getElementById('location').value= asset.location_id,
    document.getElementById('room').value= asset.room,
    document.getElementById('status').value= asset.status_id,
    document.getElementById('bar_code').value= asset.bar_code,
    document.getElementById('condition').value= asset.condition_id,
    document.getElementById('serial_number').value= asset.serial_number,
    document.getElementById('expected_life').value= asset.expected_life,
    document.getElementById('warranty').value= asset.warranty,
    document.getElementById('description').value= asset.description,
    form.classList.toggle('show');
    if (form.classList.contains('show')) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}
function closeEditForm() {
    const form = document.getElementById('assetForm');
    form.classList.toggle('show');
}

async function handleSubmit(event) {
    event.preventDefault();
    const assetData = {
        id: document.getElementById('id').value,
        department: document.getElementById('department').value,
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        purchase_date: document.getElementById('purchase_date').value,
        price: document.getElementById('price').value,
        location: document.getElementById('location').value,
        room: document.getElementById('room').value,
        status: document.getElementById('status').value,
        bar_code: document.getElementById('bar_code').value,
        condition: document.getElementById('condition').value,
        serial_number: document.getElementById('serial_number').value,
        expected_life: document.getElementById('expected_life').value,
        warranty: document.getElementById('warranty').value,
        description: document.getElementById('description').value,
    };
    try {
        const response = await fetch(url+'editAsset.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assetData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Asset editted successfully!');
            fetchAssets();
            closeEditForm();
            filterAssets();
        } else {
            alert('Failed to edit asset: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting asset:', error);
        alert('Error editting asset!');
    }
}

function fetchCategories() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const categorySelects = document.querySelectorAll('.category-select');

            categorySelects.forEach(categorySelect => {
                categorySelect.innerHTML = '<option value="">Select Category</option>';
                data.asset_category.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.description;
                    categorySelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function fetchDepartments() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const departmentSelects = document.querySelectorAll('.department-select');

            departmentSelects.forEach(departmentSelect => {
                departmentSelect.innerHTML = '<option value="">Select Department</option>';
                
                data.department.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.id;
                    option.textContent = department.name;
                    departmentSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
}

function fetchTypes() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const typeSelects = document.querySelectorAll('.type-select');

            typeSelects.forEach(typeSelect => {
                typeSelect.innerHTML = '<option value="">Select Type</option>';
                
                data.asset_type.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.id;
                    option.textContent = type.description;
                    typeSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching types:', error));
}

function fetchLocations() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const locationSelects = document.querySelectorAll('.location-select');

            locationSelects.forEach(locationSelect => {
                locationSelect.innerHTML = '<option value="">Select Location</option>';
                
                data.asset_location.forEach(location => {
                    const option = document.createElement('option');
                    option.value = location.id;
                    option.textContent = location.description;
                    locationSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching locations:', error));
}

function fetchstatuses() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const statusSelects = document.querySelectorAll('.status-select');

            statusSelects.forEach(statusSelect => {
                statusSelect.innerHTML = '<option value="">Select status</option>';
                
                data.asset_status.forEach(status => {
                    const option = document.createElement('option');
                    option.value = status.id;
                    option.textContent = status.description;
                    statusSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching statuses:', error));
}

function fetchConditions() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const conditionSelects = document.querySelectorAll('.condition-select');

            conditionSelects.forEach(conditionSelect => {
                conditionSelect.innerHTML = '<option value="">Select Condition</option>';
                
                data.asset_condition.forEach(condition => {
                    const option = document.createElement('option');
                    option.value = condition.id;
                    option.textContent = condition.description;
                    conditionSelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('Error fetching conditions:', error));
}
function deleteAsset(event){
    event.preventDefault();
    if (confirm('Are you sure you want to delete this asset?')) {
        const assetId = document.getElementById('id').value;
        handleDeleteAsset(assetId);
    }
}
async function handleDeleteAsset(assetId) {
    try {
        const response = await fetch(url+`deleteAsset.php?id=${assetId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Asset deleted successfully!');
            fetchAssets();
            closeEditForm();
        } else {
            alert('Failed to delete asset: ' + response.error);
        }
    } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Error deleting asset!');
    }
}

function generateReport() {
    fetchCategoryAssets();
    const report = document.getElementById('report');
    const button = document.querySelector('.report-button');
    if (report.classList.contains('show')) {
        report.classList.remove('show');
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg> Generate Report';
    } else {
        report.classList.add('show');
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg> Close Report';
        openReportModal();
    }
    if (report.classList.contains('show')) {
        report.scrollIntoView({ behavior: 'smooth' });
    }
}
function openReportModal() {
    document.getElementById('report-modal').style.display = 'flex';
}
function closeReportModal() {
    generateReport();
    document.getElementById('report-modal').style.display = 'none';
}
async function fetchCategoryAssets() {
    const departmentId = document.getElementById('department-select').value;
    const category_url = url+`getAssetReportBody.php?department=${departmentId}`;
    try {
        const response = await fetch(category_url);
        const data = await response.json();
        fillCategoryTables(data);
    } catch (error) {
        console.error('Error fetching category assets:', error);
    }
}
function fillCategoryTables(data) {
    const reportContainer = document.getElementById('report-body');
    reportContainer.innerHTML = '';
    const categorySelect = document.getElementById('asset-search-category');
    const selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;
    for (const [category, assets] of Object.entries(data)) {
        if (assets.length === 0) continue;
        if (selectedCategory !== "Select Category" && category !== selectedCategory) continue;
        const categoryTable = `
            <h3 class="categoryHeading">${category}</h3>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Purchase Date</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Expected Life</th>
                    <th>Warranty</th>
                </tr>
                ${assets.map(asset => `
                    <tr>
                        <td>${asset.asset_name}</td>
                        <td>${asset.asset_brand}</td>
                        <td>${asset.department}</td>
                        <td>${asset.type}</td>
                        <td>${asset.purchase_date}</td>
                        <td>$${asset.price}</td>
                        <td>${asset.location}</td>
                        <td>${asset.status}</td>
                        <td>${asset.expected_life}</td>
                        <td>${asset.warranty}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        reportContainer.innerHTML += categoryTable;
    }
}

function addAsset(){
    window.location.href = `addAsset.html`;
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF('p', 'mm', 'a4'); // A4 size PDF in portrait mode

    let reportElement = document.getElementById("report");

    // Store the original styles
    let originalStyles = {
        maxHeight: reportElement.style.maxHeight,
        overflow: reportElement.style.overflow
    };

    // Temporarily modify the styles for PDF generation
    reportElement.style.maxHeight = 'none';
    reportElement.style.overflow = 'visible';

    // Use html2canvas to capture the modal content as an image
    let canvas = await html2canvas(reportElement, { scale: 2 });
    let imgData = canvas.toDataURL("image/png");

    let imgWidth = 210; // A4 width in mm
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);

    // Revert the styles back to their original state
    reportElement.style.maxHeight = originalStyles.maxHeight;
    reportElement.style.overflow = originalStyles.overflow;

    // Open in new tab instead of auto-downloading
    window.open(doc.output('bloburl'), '_blank');
}

window.addEventListener('DOMContentLoaded', fetchCategories);
window.addEventListener('DOMContentLoaded', fetchDepartments);
window.addEventListener('DOMContentLoaded', fetchTypes);
window.addEventListener('DOMContentLoaded', fetchLocations);
window.addEventListener('DOMContentLoaded', fetchstatuses);
window.addEventListener('DOMContentLoaded', fetchConditions);
document.addEventListener('DOMContentLoaded', fetchAssets);

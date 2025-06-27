const url= base_url;
async function handleSubmit(event) {
    event.preventDefault();

    const assetData = {
        department: document.getElementById('department').value,
        name: document.getElementById('name').value,
        brand: document.getElementById('brand').value,
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
        const response = await fetch(url+'addAsset.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assetData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Asset added successfully!');
            clearAssetForm();
        } else {
            alert('Failed to add asset: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding asset:', error);
        alert('Error adding asset!');
    }
}

function clearAssetForm(){
    document.getElementById('department').value= '';
    document.getElementById('name').value= '';
    document.getElementById('brand').value= '';
    document.getElementById('category').value= '';
    document.getElementById('type').value= '';
    document.getElementById('purchase_date').value= '';
    document.getElementById('price').value= '';
    document.getElementById('location').value= '';
    document.getElementById('room').value= '';
    document.getElementById('status').value= '';
    document.getElementById('bar_code').value= '';
    document.getElementById('condition').value= '';
    document.getElementById('serial_number').value= '';
    document.getElementById('expected_life').value= '';
    document.getElementById('warranty').value= '';
    document.getElementById('description').value= '';
}

function backToAssets(){
    window.location.href= 'assetList.html';
}

function fetchCategories() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            const newOption = document.createElement('option');
            newOption.value = "new";
            newOption.textContent = "(New)";
            categorySelect.appendChild(newOption);
            data.asset_category.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.description;
            categorySelect.appendChild(option);
            categorySelect.addEventListener('change', function () {
                if (this.value === "new") {
                    openModal('category-modal');
                }
            });
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function fetchDepartments() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const departmentSelect = document.getElementById('department');
            departmentSelect.innerHTML = '<option value="">Select Department</option>';
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '(New)';
            departmentSelect.appendChild(newOption);
            
            data.department.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                departmentSelect.appendChild(option);
            });
            departmentSelect.addEventListener('change', function () {
                if (this.value === "new") {
                    openModal('department-modal');
                }
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
}

function fetchTypes() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const typeSelect = document.getElementById('type');
            typeSelect.innerHTML = '<option value="">Select Type</option>';
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '(New)';
            typeSelect.appendChild(newOption);
            
            data.asset_type.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.description;
                typeSelect.appendChild(option);
            });
            typeSelect.addEventListener('change', function () {
                if (this.value === "new") {
                    openModal('type-modal');
                }
            });
        })
        .catch(error => console.error('Error fetching types:', error));
}

function fetchLocations() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const locationSelect = document.getElementById('location');
            locationSelect.innerHTML = '<option value="">Select Location</option>';
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '(New)';
            locationSelect.appendChild(newOption);
            
            data.asset_location.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.description;
                locationSelect.appendChild(option);
            });
            locationSelect.addEventListener('change', function () {
                if (this.value === "new") {
                    loadAddLocationData();
                    openModal('location-modal');
                }
            });
        })
        .catch(error => console.error('Error fetching locations:', error));
}

function fetchstatuses() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const statusSelect = document.getElementById('status');
            statusSelect.innerHTML = '<option value="">Select status</option>';
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '(New)';
            statusSelect.appendChild(newOption);
            
            data.asset_status.forEach(status => {
                const option = document.createElement('option');
                option.value = status.id;
                option.textContent = status.description;
                statusSelect.appendChild(option);
            });
            statusSelect.addEventListener('change', function () {
                if (this.value === "new") {
                    openModal('status-modal');
                }
            });
        })
        .catch(error => console.error('Error fetching statuses:', error));
}

function fetchConditions() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            const conditionSelect = document.getElementById('condition');
            conditionSelect.innerHTML = '<option value="">Select Condition</option>';
            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '(New)';
            conditionSelect.appendChild(newOption);
            
            data.asset_condition.forEach(condition => {
                const option = document.createElement('option');
                option.value = condition.id;
                option.textContent = condition.description;
                conditionSelect.appendChild(option);
            });
            conditionSelect.addEventListener('change', function () {
                if (this.value === "new") {
                    openModal('condition-modal');
                }
            });
        })
        .catch(error => console.error('Error fetching conditions:', error));
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}
async function loadAddLocationData() {
    try {
        const [departmentsResponse] = await Promise.all([
            fetch(url+'getDepartments.php'),
        ]);
        const departments = await departmentsResponse.json();
        populateDropdown('location-department', departments.data);
    } catch (error) {
        console.error('Error loading issue form data:', error);
        alert('Error loading issue form data!');
    }
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.getElementById(modalId).querySelector('form').reset();
    switch (modalId) {
        case 'department-modal':
            reloadDepartments();
            break;
        case 'category-modal':
            reloadCategories();
            break;
        case 'type-modal':
            reloadTypes();
            break;
        case 'location-modal':
            reloadLocations();
            break;
        case 'status-modal':
            reloadStatuses();
            break;
        case 'condition-modal':
            reloadConditions();
            break;
        default:
            console.warn('No reload function defined for:', modalId);
    }
}
function populateDropdown(dropdownId, data) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select ' + dropdownId.replace('issue-', '') + '</option>';
    if(dropdownId != 'location-department'){
        const newOption = document.createElement('option');
        newOption.value = 'new';
        newOption.textContent = '(New)';
        dropdown.appendChild(newOption);
    }
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name || item.description;
        dropdown.appendChild(option);
    });
}
async function handleAddDepartment(event) {
    event.preventDefault();
    const departmentData = {
        name: document.getElementById('department-name').value,
        code: document.getElementById('department-code').value,
    };
    try {
        const response = await fetch(url+'addDepartment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentData),
        });
        const result = await response.json();

        if (result.success) {
            alert('Department added successfully!');
            closeModal('department-modal');
        } else {
            alert('Failed to add department: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Error adding department!');
    }
}
async function reloadDepartments() {
    try {
        const response = await fetch(url+'getDepartments.php');
        const departments = await response.json();
        populateDropdown('department', departments.data);
    } catch (error) {
        console.error('Error loading departments data:', error);
        alert('Error loading departments data!');
    }
}
async function handleAddCategory(event) {
    event.preventDefault();
    const categoryData = {
        name: document.getElementById('category-name').value,
        code: document.getElementById('category-code').value,
    };

    try {
        const response = await fetch(url+'addAssetCategory.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Category added successfully!');
            closeModal('category-modal');
        } else {
            alert('Failed to add category: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category!');
    }
}
async function reloadCategories() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            populateDropdown('category', data.asset_category)
        })
    .catch(error => console.error('Error fetching categories:', error));
}
async function handleAddType(event) {
    event.preventDefault();
    const typeData = {
        name: document.getElementById('type-name').value,
        code: document.getElementById('type-code').value,
    };
    try {
        const response = await fetch(url+'addAssetType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(typeData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Type added successfully!');
            closeModal('type-modal');
        } else {
            alert('Failed to add type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding type:', error);
        alert('Error adding type!');
    }
}
async function reloadTypes() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            populateDropdown('type', data.asset_type)
        })
    .catch(error => console.error('Error fetching types:', error));
}
async function handleAddLocation(event) {
    event.preventDefault();

    const locationData = {
        name: document.getElementById('location-name').value,
        code: document.getElementById('location-code').value,
        department_id: document.getElementById('location-department').value,
    };

    try {
        const response = await fetch(url+'addAssetLocation.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Location added successfully!');
            closeModal('location-modal')
        } else {
            alert('Failed to add location: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding location:', error);
        alert('Error adding location!');
    }
}
async function reloadLocations() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            populateDropdown('location', data.asset_location)
        })
    .catch(error => console.error('Error fetching locations:', error));
}
async function handleAddStatus(event) {
    event.preventDefault();

    const statusData = {
        name: document.getElementById('status-name').value,
        code: document.getElementById('status-code').value,
    };
    try {
        const response = await fetch(url+'addAssetStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusData),
        });
        const result = await response.json();
        if (result.success) {
            alert('status added successfully!');
            closeModal('status-modal')
        } else {
            alert('Failed to add status: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding status:', error);
        alert('Error adding status!');
    }
}
async function reloadStatuses() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            populateDropdown('status', data.asset_status)
        })
    .catch(error => console.error('Error fetching statuss:', error));
}
async function handleAddCondition(event) {
    event.preventDefault();

    const conditionData = {
        name: document.getElementById('condition-name').value,
        code: document.getElementById('condition-code').value,
    };

    try {
        const response = await fetch(url+'addAssetCondition.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conditionData),
        });

        const result = await response.json();

        if (result.success) {
            alert('condition added successfully!');
            closeModal('condition-modal')
        } else {
            alert('Failed to add condition: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding condition:', error);
        alert('Error adding condition!');
    }
}
async function reloadConditions() {
    fetch(url+'getAssetSettingsData.php')
        .then(response => response.json())
        .then(data => {
            populateDropdown('condition', data.asset_condition)
        })
    .catch(error => console.error('Error fetching conditions:', error));
}

window.addEventListener('DOMContentLoaded', fetchCategories);
window.addEventListener('DOMContentLoaded', fetchDepartments);
window.addEventListener('DOMContentLoaded', fetchTypes);
window.addEventListener('DOMContentLoaded', fetchLocations);
window.addEventListener('DOMContentLoaded', fetchstatuses);
window.addEventListener('DOMContentLoaded', fetchConditions);
const url= base_url;
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

function showEditForm(entity, id, name, code) {
    const addForm = document.getElementById(`${entity}-form`);
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById(`${entity}-edit-form`);
    if (editForm) {
        document.getElementById(`edit-${entity}-id`).value = id;
        document.getElementById(`edit-${entity}-name`).value = name;
        document.getElementById(`edit-${entity}-code`).value = code;
        editForm.style.display = 'block';
        editForm.scrollIntoView({ behavior: 'smooth' });
    }
}

async function showLocationEditForm(id, department_id, name, code) {
    const addForm = document.getElementById('location-edit-form');
    if (addForm) {
        addForm.style.display = 'none';
    }

    const editForm = document.getElementById('location-edit-form');
    if (editForm) {
        await populateDepartmentDropdown(department_id);
        document.getElementById('edit-location-id').value = id;
        document.getElementById('edit-location-name').value = name;
        document.getElementById('edit-location-code').value = code;
        editForm.style.display = 'block';
        editForm.scrollIntoView({ behavior: 'smooth' });
    }
}

async function populateDepartmentDropdown(selectedDepartmentId) {
    const data = await fetchDepartmentsData();
    const departmentDropdown = document.getElementById('location-department-edit');
    if (departmentDropdown) {
        departmentDropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Department';
        departmentDropdown.appendChild(defaultOption);
        data.data.forEach(data => {
            const option = document.createElement('option');
            option.value = data.id;
            option.textContent = `${data.name}`;
            if (data.id == selectedDepartmentId) {
                option.selected = true;
            }

            departmentDropdown.appendChild(option);
        });
    }
}
async function fetchDepartmentsData() {
    const response = await fetch(url+'getDepartments.php');
    const data = await response.json();
    return data;
}

async function submitLocationEditForm() {
    const id = document.getElementById('edit-location-id').value;
    const departmentId = document.getElementById('location-department-edit').value;
    const description = document.getElementById('edit-location-name').value;
    const code = document.getElementById('edit-location-code').value;
    if (!id || !description) {
        alert('Please fill in all fields');
        return;
    }
    const data = {
        id: id,
        department_id: departmentId,
        description: description,
        code: code
    };
    try {
        const response = await fetch(url+'updateLocation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.status === 'success') {
            alert('Location updated successfully');
            populateLists();
            toggleForm('location-edit-form');
        } else {
            alert('Failed to update location: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the location');
    }
}

async function saveEditDepartment() {
    const departmentData = {
        id: document.getElementById('edit-department-id').value,
        name: document.getElementById('edit-department-name').value,
        code: document.getElementById('edit-department-code').value,
    };
    try {
        const response = await fetch(url+'editDepartment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Department saved!');
            toggleForm('department-edit-form');
            populateLists();
        } else {
            alert('Failed to edit department: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting department:', error);
        alert('Error editting department!');
    }
}
async function saveEditForm(entity) {
    const id = document.getElementById(`edit-${entity}-id`).value;
    const name = document.getElementById(`edit-${entity}-name`).value;
    const code = document.getElementById(`edit-${entity}-code`).value;
    if (!name) {
        alert('Please fill in all fields');
        return;
    }
    const data = {
        entity: entity,
        id: id,
        name: name,
        code: code
    };
    try {
        const response = await fetch(url+'update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert('Record updated successfully');
            populateLists();
        } else {
            alert('Failed to update record: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the record');
    }
    toggleForm(`${entity}-edit-form`);
}

async function fetchActionsData() {
    const response = await fetch(url+'getAssetSettingsData.php');
    const data = await response.json();
    return data;
}
async function populateLists() {
    const data = await fetchActionsData();
    const departmentList = document.getElementById('department-list');
    if (departmentList) {
        departmentList.innerHTML = data.department.map(dept => `
            <li data-id="${dept.id}" data-description="${dept.name}" data-code="${dept.code}">
                ${dept.name}
            </li>
        `).join('');
        document.querySelectorAll("#department-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const departmentId = this.getAttribute("data-id");
                    const departmentCode = this.getAttribute("data-code");
                    const departmentDescription = this.getAttribute("data-description");
                    showEditForm('department', departmentId, departmentDescription, departmentCode);
                }
            });
        });
    }
    const departmentDropdown = document.getElementById('location-department');
    if (departmentDropdown) {
        departmentDropdown.innerHTML = '<option value="">Select Department</option>';
        data.department.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = `${dept.name}`;
            departmentDropdown.appendChild(option);
        });
    }
    const categoryList = document.getElementById('category-list');
    if (categoryList) {
        categoryList.innerHTML = data.asset_category.map(cat => `
            <li data-id="${cat.id}" data-description="${cat.description}" data-code="${cat.code}">
                ${cat.description}  
            </li>
        `).join('');
        document.querySelectorAll("#category-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const categoryId = this.getAttribute("data-id");
                    const categoryCode = this.getAttribute("data-code");
                    const categoryDescription = this.getAttribute("data-description");
                    showEditForm('category', categoryId, categoryDescription, categoryCode);
                }
            });
        });
    }
    const typeList = document.getElementById('type-list');
    if (typeList) {
        typeList.innerHTML = data.asset_type.map(type => `
            <li data-id="${type.id}" data-description="${type.description}" data-code="${type.code}">
                ${type.description}
            </li>
        `).join('');
        document.querySelectorAll("#type-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const typeId = this.getAttribute("data-id");
                    const typeCode = this.getAttribute("data-code");
                    const typeDescription = this.getAttribute("data-description");
                    showEditForm('type', typeId, typeDescription, typeCode);
                }
            });
        });
    }
    const locationList = document.getElementById('location-list');
    if (locationList) {
        locationList.innerHTML = data.asset_location.map(loc => `
            <li data-id="${loc.id}" data-department="${loc.department_id}" data-description="${loc.description}" data-code="${loc.code}">
                ${loc.description}
            </li>
        `).join('');
        document.querySelectorAll("#location-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const locationId = this.getAttribute("data-id");
                    const locationDepartment = this.getAttribute("data-department");
                    const locationCode = this.getAttribute("data-code");
                    const locationDescription = this.getAttribute("data-description");
                    showLocationEditForm(locationId, locationDepartment, locationDescription, locationCode);
                }
            });
        });
    }
    const statusList = document.getElementById('status-list');
    if (statusList) {
        statusList.innerHTML = data.asset_status.map(status => `
            <li data-id="${status.id}" data-description="${status.description}" data-code="${status.code}">
                ${status.description}
            </li>
        `).join('');
        document.querySelectorAll("#status-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const statusId = this.getAttribute("data-id");
                    const statusCode = this.getAttribute("data-code");
                    const statusDescription = this.getAttribute("data-description");
                    showEditForm('status', statusId, statusDescription, statusCode);
                }
            });
        });
    }
    const conditionList = document.getElementById('condition-list');
    if (conditionList) {
        conditionList.innerHTML = data.asset_condition.map(cond => `
            <li data-id="${cond.id}" data-description="${cond.description}" data-code="${cond.code}">
                ${cond.description}
            </li>
        `).join('');
        document.querySelectorAll("#condition-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const conditionId = this.getAttribute("data-id");
                    const conditionCode = this.getAttribute("data-code");
                    const conditionDescription = this.getAttribute("data-description");
                    showEditForm('condition', conditionId, conditionDescription, conditionCode);
                }
            });
        });
    }
}
window.onload = populateLists;

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
        } else {
            alert('Failed to add department: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Error adding department!');
    }
    clearAddDepartment();
    populateLists();
}
function clearAddDepartment() {
    document.getElementById('department-name').value = '';
    document.getElementById('department-code').value = '';
    toggleForm('department-form');
}

async function deleteDepartment(event) {
    event.preventDefault();
    const id = document.getElementById('edit-department-id').value;
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
        const response = await fetch(url+`deleteDepartment.php?id=${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Department deleted successfully!');
            toggleForm('department-edit-form');
        } else {
            alert('Failed to delete department: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting department:', error);
        alert('Error deleting department!');
    }
    populateLists();
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
        } else {
            alert('Failed to add category: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category!');
    }
    clearAddCategory();
    populateLists();
}
function clearAddCategory() {
    document.getElementById('category-name').value = '';
    document.getElementById('category-code').value = '';
    toggleForm('category-form');
}

async function deleteCategory(event) {
    event.preventDefault();
    const id = document.getElementById('edit-category-id').value;
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        const response = await fetch(url+`deleteAssetCategory.php?id=${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Category deleted successfully!');
            toggleForm('category-edit-form');
        } else {
            alert('Failed to delete category: ');
        }
    } 
    catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category!');
    }
    populateLists();
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
        } else {
            alert('Failed to add type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding type:', error);
        alert('Error adding type!');
    }
    clearAddType();
    populateLists();
}
function clearAddType() {
    document.getElementById('type-name').value = '';
    document.getElementById('type-code').value = '';
    toggleForm('type-form');
}

async function deleteType(event) {
    event.preventDefault();
    const id = document.getElementById('edit-type-id').value;
    if (!confirm('Are you sure you want to delete this type?')) return;
    try {
        const response = await fetch(url+`deleteAssetType.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Type deleted successfully!');
            toggleForm('type-edit-form');
        } else {
            alert('Failed to delete type: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting type:', error);
        alert('Error deleting type!');
    }
    populateLists();
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
        } else {
            alert('Failed to add location: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding location:', error);
        alert('Error adding location!');
    }
    clearAddLocation();
    populateLists();
}
function clearAddLocation() {
    document.getElementById('location-name').value = '';
    document.getElementById('location-code').value = '';
    toggleForm('location-form');
}

async function deleteLocation(event) {
    event.preventDefault();
    const id = document.getElementById('edit-location-id').value;
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
        const response = await fetch(url+`deleteAssetLocation.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Location deleted successfully!');
            toggleForm('location-edit-form');
        } else {
            alert('Failed to delete location: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting location:', error);
        alert('Error deleting location!');
    }
    populateLists();
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
        } else {
            alert('Failed to add status: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding status:', error);
        alert('Error adding status!');
    }
    clearAddStatus();
    populateLists();
}
function clearAddStatus() {
    document.getElementById('status-name').value = '';
    document.getElementById('status-code').value = '';
    toggleForm('status-form');
}

async function deleteStatus(event) {
    event.preventDefault();
    const id = document.getElementById('edit-status-id').value;
    if (!confirm('Are you sure you want to delete this status?')) return;
    try {
        const response = await fetch(url+`deleteAssetStatus.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Status deleted successfully!');
            toggleForm('status-edit-form');
        } else {
            alert('Failed to delete status: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting status:', error);
        alert('Error deleting status!');
    }
    populateLists();
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
        } else {
            alert('Failed to add condition: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding condition:', error);
        alert('Error adding condition!');
    }
    clearAddCondition();
    populateLists();
}
function clearAddCondition() {
    document.getElementById('condition-name').value = '';
    document.getElementById('condition-code').value = '';
    toggleForm('condition-form');
}

async function deleteCondition(event) {
    event.preventDefault();
    const id = document.getElementById('edit-condition-id').value;
    if (!confirm('Are you sure you want to delete this condition?')) return;
    try {
        const response = await fetch(url+`deleteAssetCondition.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Condition deleted successfully!');
            toggleForm('condition-edit-form');
        } else {
            alert('Failed to delete condition: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting condition:', error);
        alert('Error deleting condition!');
    }
    populateLists();
}
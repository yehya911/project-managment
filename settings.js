const url= base_url;
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function showProjectEditForm(entity, id, name, description) {
    const addForm = document.getElementById(`${entity}-form`);
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById(`${entity}-edit-form`);
    if (editForm) {
        document.getElementById(`edit-${entity}-id`).value = id;
        document.getElementById(`edit-${entity}-name`).value = name;
        document.getElementById(`edit-${entity}-description`).value = description;
        editForm.style.display = 'block';
    }
}
function showDepartmentEditForm(entity, id, name, code) {
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
    }
}
function showStatusEditForm(entity, id, name, code) {
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
    }
}
function showDeviceTypeEditForm(id, name, code) {
    const addForm = document.getElementById('deviceType-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('deviceType-edit-form');
    if (editForm) {
        document.getElementById('edit-deviceType-id').value = id;
        document.getElementById('edit-deviceType-name').value = name;
        document.getElementById('edit-deviceType-code').value = code;
        editForm.style.display = 'block';
    }
}
function showIssueTypeEditForm(id, type, code) {
    const addForm = document.getElementById('issueType-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('issueType-edit-form');
    if (editForm) {
        document.getElementById('edit-issueType-id').value = id;
        document.getElementById('edit-issueType-name').value = type;
        document.getElementById('edit-issueType-code').value = code;
        editForm.style.display = 'block';
    }
}
function showPriorityEditForm(id, priority, code) {
    const addForm = document.getElementById('priority-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('priority-edit-form');
    if (editForm) {
        document.getElementById('edit-priority-id').value = id;
        document.getElementById('edit-priority-name').value = priority;
        document.getElementById('edit-priority-code').value = code;
        editForm.style.display = 'block';
    }
}
function showMaintenanceEditForm(id, maintenanceType, code) {
    const addForm = document.getElementById('maintenance-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('maintenance-edit-form');
    if (editForm) {
        document.getElementById('edit-maintenance-id').value = id;
        document.getElementById('edit-maintenance-name').value = maintenanceType;
        document.getElementById('edit-maintenance-code').value = code;
        editForm.style.display = 'block';
    }
}
function showSupplierEditForm(id, supplier, code) {
    const addForm = document.getElementById('supplier-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('supplier-edit-form');
    if (editForm) {
        document.getElementById('edit-supplier-id').value = id;
        document.getElementById('edit-supplier-name').value = supplier;
        document.getElementById('edit-supplier-code').value = code;
        editForm.style.display = 'block';
    }
}
async function showUserEditForm(id, abbreviation, role, name) {
    const addForm = document.getElementById('user-edit-form');
    if (addForm) {
        addForm.style.display = 'none';
    }
    const editForm = document.getElementById('user-edit-form');
    if (editForm) {
        await populateRoleDropdown(role);
        document.getElementById('edit-user-id').value = id;
        document.getElementById('edit-user-name').value = name;
        document.getElementById('edit-user-role').value = role;
        editForm.style.display = 'block';
    }
}
async function populateRoleDropdown(selectedRoleId) {
    const response = await fetchRoles();
    const roleDropdown = document.getElementById('edit-user-role');
    if (roleDropdown) {
        roleDropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Role';
        roleDropdown.appendChild(defaultOption);
        response.data.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = `${role.description}`;
            if (role.id == selectedRoleId) {
                option.selected = true;
            }
            roleDropdown.appendChild(option);
        });
    }
}
async function fetchRoles() {
    const response = await fetch(url+'getRoles.php');
    const data = await response.json();
    return data;
}

async function populatedropdowns() {
    const response = await fetchRoles();
    const roleDropdown = document.getElementById('user-role');
    if (roleDropdown) {
        roleDropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Role';
        roleDropdown.appendChild(defaultOption);
        response.data.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = `${role.description}`;
            roleDropdown.appendChild(option);
        });
    }
}
async function fetchSettingsData() {
    const response = await fetch(url+'getSettingsData.php');
    const data = await response.json();
    return data;
}
async function populateLists() {
    const data = await fetchSettingsData();
    const projectsList = document.getElementById('project-list');
    if (projectsList) {
        projectsList.innerHTML = data.project.map(project => `
            <li data-id="${project.id}" data-name="${project.name}" data-description="${project.description}">
            ${project.name}
        </li>
        `).join('');
        document.querySelectorAll("#project-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const projectId = this.getAttribute("data-id");
                    const projectName = this.getAttribute("data-name");
                    const projectDescription = this.getAttribute("data-description");
                    showProjectEditForm('project', projectId, projectName, projectDescription);
                }
            });
        });
    }
    const departmentList = document.getElementById('department-list');
    if (departmentList) {
        departmentList.innerHTML = data.department.map(dept => `
            <li data-id="${dept.id}" data-name="${dept.name}" data-code="${dept.code}">
                ${dept.name}
            </li>
        `).join('');
        document.querySelectorAll("#department-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const departmentId = this.getAttribute("data-id");
                    const departmentName = this.getAttribute("data-name");
                    const departmentcode = this.getAttribute("data-code");
                    showDepartmentEditForm('department', departmentId, departmentName, departmentcode);
                }
            });
        });
    }
    const userList = document.getElementById('user-list');
    if (userList) {
        userList.innerHTML = data.user.map(user => `
            <li data-id="${user.id}" data-name="${user.name}" data-abbreviation="${user.abbreviation}" data-role="${user.role_id}">
                ${user.name}
            </li>
        `).join('');
        document.querySelectorAll("#user-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const userId = this.getAttribute("data-id");
                    const userName = this.getAttribute("data-name");
                    const userabbreviation = this.getAttribute("data-abbreviation");
                    const userRole = this.getAttribute("data-role");
                    showUserEditForm(userId, userabbreviation, userRole, userName);
                }
            });
        });
    }
    const statusList = document.getElementById('status-list');
    if (statusList) {
        statusList.innerHTML = data.issue_status.map(status => `
            <li data-id="${status.id}" data-status="${status.status}" data-code="${status.code}">
                ${status.status}
            </li>
        `).join('');
        document.querySelectorAll("#status-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const statusId = this.getAttribute("data-id");
                    const statusStatus = this.getAttribute("data-status");
                    const statuscode = this.getAttribute("data-code");
                    showStatusEditForm('status', statusId, statusStatus, statuscode);
                }
            });
        });
    }
    const devTypeList = document.getElementById('devType-list');
    if (devTypeList) {
        devTypeList.innerHTML = data.device_type.map(dType => `
            <li data-id="${dType.id}" data-type="${dType.device_type}" data-code="${dType.code}">
                ${dType.device_type}
            </li>
        `).join('');
        document.querySelectorAll("#devType-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const devTypeId = this.getAttribute("data-id");
                    const type = this.getAttribute("data-type");
                    const devTypecode = this.getAttribute("data-code");
                    showDeviceTypeEditForm(devTypeId, type, devTypecode);
                }
            });
        });
    }
    const deviceList = document.getElementById('device-list');
    if (deviceList) {
        deviceList.innerHTML = data.device.map(device => `
            <li data-id="${device.id}" data-department="${device.department_id}" data-name="${device.name}" data-type="${device.device_type_id}">
                ${device.name}
            </li>
        `).join('');
        document.querySelectorAll("#device-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const deviceId = this.getAttribute("data-id");
                    const deviceDepartment = this.getAttribute("data-department");
                    const deviceName = this.getAttribute("data-name");
                    const deviceType = this.getAttribute("data-type");
                    showDeviceEditForm(deviceId, deviceDepartment, deviceName, deviceType);
                }
            });
        });
    }
    const issueTypeList = document.getElementById('issueType-list');
    if (issueTypeList) {
        issueTypeList.innerHTML = data.issue_type.map(issueType => `
            <li data-id="${issueType.id}" data-type="${issueType.type}" data-code="${issueType.code}">
                ${issueType.type}
            </li>
        `).join('');
        document.querySelectorAll("#issueType-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const issueTypeId = this.getAttribute("data-id");
                    const issueTypeName = this.getAttribute("data-type");
                    const issueTypecode = this.getAttribute("data-code");
                    showIssueTypeEditForm(issueTypeId, issueTypeName, issueTypecode);
                }
            });
        });
    }
    const priorityList = document.getElementById('priority-list');
    if (priorityList) {
        priorityList.innerHTML = data.issue_priority.map(priority => `
            <li data-id="${priority.id}" data-priority="${priority.priority}" data-code="${priority.code}">
                ${priority.priority}
            </li>
        `).join('');
        document.querySelectorAll("#priority-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const priorityId = this.getAttribute("data-id");
                    const priorityName = this.getAttribute("data-priority");
                    const prioritycode = this.getAttribute("data-code");
                    showPriorityEditForm(priorityId, priorityName, prioritycode);
                }
            });
        });
    }
    const maintenanceList = document.getElementById('maintenance-list');
    if (maintenanceList) {
        maintenanceList.innerHTML = data.maintenance.map(m => `
            <li data-id="${m.id}" data-name="${m.type}" data-code="${m.code}">
                ${m.type}
            </li>
        `).join('');
        document.querySelectorAll("#maintenance-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const maintenanceId = this.getAttribute("data-id");
                    const maintenanceType = this.getAttribute("data-name");
                    const maintenancecode = this.getAttribute("data-code");
                    showMaintenanceEditForm(maintenanceId, maintenanceType, maintenancecode);
                }
            });
        });
    }
    const supplierList = document.getElementById('supplier-list');
    if (supplierList) {
        supplierList.innerHTML = data.supplier.map(sup => `
            <li data-id="${sup.id}" data-name="${sup.name}" data-code="${sup.code}">
                ${sup.name}
            </li>
        `).join('');
        document.querySelectorAll("#supplier-list li").forEach(item => {
            item.addEventListener("click", function(event) {
                if (!event.target.classList.contains("delete-btn")) {
                    const supplierId = this.getAttribute("data-id");
                    const supplier = this.getAttribute("data-name");
                    const suppliercode = this.getAttribute("data-code");
                    showSupplierEditForm(supplierId, supplier, suppliercode);
                }
            });
        });
    }
}
window.onload = function() {
    populateLists();
    populatedropdowns();
};

async function handleAddProject(event) {
    event.preventDefault();
    const projectData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
    };
    if (!projectData.name) {
        alert('Project name is required.');
        return;
    }
    try {
        const response = await fetch(url+'addProject.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Project added successfully!');
            toggleForm('project-form');
            clearProjectForm();
            populateLists();
        } else {
            alert('Failed to add project: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project!');
    }
}
function clearProjectForm() {
    document.getElementById('project-name').value = '';
    document.getElementById('project-description').value = '';
}
function deleteProject(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this project?')) {
        const projectId = document.getElementById('edit-project-id').value;
        handleDeleteProject(projectId);
    }
}
async function handleDeleteProject(projectId) {
    try {
        const response = await fetch(url+`deleteProject.php?id=${projectId}`, {
            method: 'DELETE',
        });
        const rawResponse = await response.text();
        const result = JSON.parse(rawResponse);
        if (result.success) {
            alert('Project deleted successfully!');
            toggleForm('project-edit-form');
            populateLists();
        } else {
            alert('Failed to delete project: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project!');
    }
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
        } else {
            alert('Failed to add department: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Error adding department!');
    }
    clearAddDepartment();
    populateLists();
    populatedropdowns();
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
        const result = await response.json();
        if (result.success) {
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
    populatedropdowns();
}
async function handleAddStatus(event) {
    event.preventDefault();

    const statusData = {
        name: document.getElementById('status-name').value,
        code: document.getElementById('status-code').value,
    };
    try {
        const response = await fetch(url+'addStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Status added successfully!');
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
        const response = await fetch(url+`deleteStatus.php?id=${id}`, {
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

async function handleAddIssueType(event) {
    event.preventDefault();

    const issueTypeData = {
        name: document.getElementById('issueType-name').value,
        code: document.getElementById('issueType-code').value,
    };
    try {
        const response = await fetch(url+'addIssueType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueTypeData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Issue Type type added successfully!');
        } else {
            alert('Failed to add issue type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding issue type:', error);
        alert('Error adding issue type!');
    }
    clearAddIssueType();
    populateLists();
}
function clearAddIssueType() {
    document.getElementById('issueType-name').value = '';
    document.getElementById('issueType-code').value = '';
    toggleForm('issueType-form');
}
async function deleteIssueType(event) {
    event.preventDefault();
    const id = document.getElementById('edit-issueType-id').value;
    if (!confirm('Are you sure you want to delete this issue type?')) return;
    try {
        const response = await fetch(url+`deleteIssueType.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Issue Type deleted successfully!');
            toggleForm('issueType-edit-form');
        } else {
            alert('Failed to delete issue type: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting issue type:', error);
        alert('Error deleting issue type!');
    }
    populateLists();
}

async function handleAddPriority(event) {
    event.preventDefault();

    const priorityData = {
        name: document.getElementById('priority-name').value,
        code: document.getElementById('priority-code').value,
    };
    try {
        const response = await fetch(url+'addPriority.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(priorityData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Priority Type type added successfully!');
        } else {
            alert('Failed to add priority type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding priority type:', error);
        alert('Error adding priority type!');
    }
    clearAddPriority();
    populateLists();
}
function clearAddPriority() {
    document.getElementById('priority-name').value = '';
    document.getElementById('priority-code').value = '';
    toggleForm('priority-form');
}
async function deletePriority(event) {
    event.preventDefault();
    const id = document.getElementById('edit-priority-id').value;
    if (!confirm('Are you sure you want to delete this priority?')) return;
    try {
        const response = await fetch(url+`deletePriority.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Priority deleted successfully!');
            toggleForm('priority-edit-form');
        } else {
            alert('Failed to delete priority: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting priority:', error);
        alert('Error deleting priority!');
    }
    populateLists();
}

async function handleAddUser(event) {
    event.preventDefault();
    const userData = {
        name: document.getElementById('user-name').value,
        role_id: document.getElementById('user-role').value,
    };
    try {
        const response = await fetch(url+'addUser.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        if (result.success) {
            alert('User added successfully!');
            clearAddUser();
            populateLists();
        } else {
            alert('Failed to add user: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user!');
    }
}
function clearAddUser() {
    document.getElementById('user-name').value = '';
    toggleForm('user-form');
}
async function deleteUser(event) {
    event.preventDefault();
    const id = document.getElementById('edit-user-id').value;
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        const response = await fetch(url+`deleteUser.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('User deleted successfully!');
            toggleForm('user-edit-form');
        } else {
            alert('Failed to delete user: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user!');
    }
    populateLists();
}

async function saveEditProject() {
    const projectData = {
        id: document.getElementById('edit-project-id').value,
        name: document.getElementById('edit-project-name').value,
        description: document.getElementById('edit-project-description').value,
    };
    try {
        const response = await fetch(url+'editProject.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Project saved!');
            toggleForm('project-edit-form');
            populateLists();
        } else {
            alert('Failed to edit project: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting project:', error);
        alert('Error editting project!');
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

async function saveEditStatus() {
    const statusData = {
        id: document.getElementById('edit-status-id').value,
        status: document.getElementById('edit-status-name').value,
        code: document.getElementById('edit-status-code').value,
    };
    try {
        const response = await fetch(url+'editStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Status saved!');
            toggleForm('status-edit-form');
            populateLists();
        } else {
            alert('Failed to edit status: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting status:', error);
        alert('Error editting status!');
    }
}

async function saveEditDevType() {
    const devTypeData = {
        id: document.getElementById('edit-deviceType-id').value,
        device_type: document.getElementById('edit-deviceType-name').value,
        code: document.getElementById('edit-deviceType-code').value,
    };
    try {
        const response = await fetch(url+'editDevType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(devTypeData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Device Type saved!');
            toggleForm('deviceType-edit-form');
            populateLists();
        } else {
            alert('Failed to edit device type: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting device type:', error);
        alert('Error editting device type!');
    }
}

async function saveEditIssueType() {
    const issueType = {
        id: document.getElementById('edit-issueType-id').value,
        type: document.getElementById('edit-issueType-name').value,
        code: document.getElementById('edit-issueType-code').value,
    };
    try {
        const response = await fetch(url+'editIssueType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueType),
        });
        const result = await response.json();
        if (result.success) {
            alert('Issue Type saved!');
            toggleForm('issueType-edit-form');
            populateLists();
        } else {
            alert('Failed to edit issue type: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting issue type:', error);
        alert('Error editting issue type!');
    }
}

async function saveEditPriority() {
    const priority = {
        id: document.getElementById('edit-priority-id').value,
        priority: document.getElementById('edit-priority-name').value,
        code: document.getElementById('edit-priority-code').value,
    };
    try {
        const response = await fetch(url+'editPriority.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(priority),
        });
        const result = await response.json();
        if (result.success) {
            alert('Issue priority saved!');
            toggleForm('priority-edit-form');
            populateLists();
        } else {
            alert('Failed to edit issue priority: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting issue priority:', error);
        alert('Error editting issue priority!');
    }
}

async function saveEditUser() {
    const userData = {
        id: document.getElementById('edit-user-id').value,
        name: document.getElementById('edit-user-name').value,
        role: document.getElementById('edit-user-role').value,
    };
    try {
        const response = await fetch(url+'editUser.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        if (result.success) {
            alert('User information saved!');
            toggleForm('user-edit-form');
            populateLists();
        } else {
            alert('Failed to edit user: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting user:', error);
        alert('Error editting user!');
    }
}

async function saveEditDevice() {
    const deviceData = {
        id: document.getElementById('edit-device-id').value,
        name: document.getElementById('edit-device-name').value,
        department_id: document.getElementById('edit-device-department').value,
        type_id: document.getElementById('edit-device-type').value,
    };
    try {
        const response = await fetch(url+'editDevice.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deviceData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Device information saved!');
            toggleForm('device-edit-form');
            populateLists();
        } else {
            alert('Failed to edit device: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting device:', error);
        alert('Error editting device!');
    }
}

async function handleAddMaintenance(event) {
    event.preventDefault();

    const maintenanceData = {
        name: document.getElementById('maintenance-name').value,
        code: document.getElementById('maintenance-code').value,
    };
    try {
        const response = await fetch(url+'addMaintenance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(maintenanceData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Maintenance added successfully!');
        } else {
            alert('Failed to add maintenance: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding maintenance:', error);
        alert('Error adding maintenance!');
    }
    clearAddMaintenance();
    populateLists();
}
function clearAddMaintenance() {
    document.getElementById('maintenance-name').value = '';
    document.getElementById('maintenance-code').value = '';
    toggleForm('maintenance-form');
}
async function deleteMaintenance(event) {
    event.preventDefault();
    const id = document.getElementById('edit-maintenance-id').value;
    if (!confirm('Are you sure you want to delete this maintenance type?')) return;
    try {
        const response = await fetch(url+`deleteMaintenance.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Maintenance type deleted successfully!');
            toggleForm('maintenance-edit-form');
        } else {
            alert('Failed to delete maintenance type: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting maintenance type:', error);
        alert('Error deleting maintenance type!');
    }
    populateLists();
}
async function saveEditMaintenance() {
    const maintenance = {
        id: document.getElementById('edit-maintenance-id').value,
        maintenance: document.getElementById('edit-maintenance-name').value,
        code: document.getElementById('edit-maintenance-code').value,
    };
    try {
        const response = await fetch(url+'editMaintenance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(maintenance),
        });
        const result = await response.json();
        if (result.success) {
            alert('Issue maintenance saved!');
            toggleForm('maintenance-edit-form');
            populateLists();
        } else {
            alert('Failed to edit issue maintenance: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting issue maintenance:', error);
        alert('Error editting issue maintenance!');
    }
}

async function handleAddSupplier(event) {
    event.preventDefault();

    const supplierData = {
        name: document.getElementById('supplier-name').value,
        code: document.getElementById('supplier-code').value,
    };
    try {
        const response = await fetch(url+'addSupplier.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplierData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Supplier added successfully!');
        } else {
            alert('Failed to add supplier: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Error adding supplier!');
    }
    clearAddSupplier();
    populateLists();
}
function clearAddSupplier() {
    document.getElementById('supplier-name').value = '';
    document.getElementById('supplier-code').value = '';
    toggleForm('supplier-form');
}
async function deleteSupplier(event) {
    event.preventDefault();
    const id = document.getElementById('edit-supplier-id').value;
    if (!confirm('Are you sure you want to delete this supplier type?')) return;
    try {
        const response = await fetch(url+`deleteSupplier.php?id=${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Supplier type deleted successfully!');
            toggleForm('supplier-edit-form');
        } else {
            alert('Failed to delete supplier type: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting supplier type:', error);
        alert('Error deleting supplier type!');
    }
    populateLists();
}
async function saveEditSupplier() {
    const supplier = {
        id: document.getElementById('edit-supplier-id').value,
        supplier: document.getElementById('edit-supplier-name').value,
        code: document.getElementById('edit-supplier-code').value,
    };
    try {
        const response = await fetch(url+'editSupplier.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplier),
        });
        const result = await response.json();
        if (result.success) {
            alert('Issue supplier saved!');
            toggleForm('supplier-edit-form');
            populateLists();
        } else {
            alert('Failed to edit issue supplier: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting issue supplier:', error);
        alert('Error editting issue supplier!');
    }
}
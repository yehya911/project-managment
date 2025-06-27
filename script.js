const url= 'http://192.168.1.3/pm/';
document.querySelectorAll('.button-group .button').forEach(button => {
    button.addEventListener('click', () => toggleForm(button.dataset.form));
});

function toggleForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        if (form.style.display === 'none' || form.style.display === '') {
            document.querySelectorAll('.form').forEach(f => {
                if (f.id !== formId && !f.id.includes('search-issues-section')) {
                    f.style.display = 'none';
                }
            });
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            form.style.display = 'none';
        }
    }
}

function hideForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'none';
    }
}

async function handleAddUser(event) {
    event.preventDefault();
    const userData = {
        name: document.getElementById('user-name').value,
        abbreviation: document.getElementById('user-abbreviation').value,
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
        } else {
            alert('Failed to add user: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user!');
    }
    clearUserForm();
    location.reload();
}

async function handleAddDepartment(event) {
    event.preventDefault();

    const departmentData = {
        name: document.getElementById('department-name').value,
        code: document.getElementById('department-code').value,
    };

    if (!departmentData.name || !departmentData.code) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addDepartment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Department added successfully!');
            hideForm('department-form');
            clearDepartmentForm();
            location.reload();
        } else {
            alert('Failed to add department: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Error adding department!');
    }
}

async function handleAddStatus(event) {
    event.preventDefault();

    const statusData = {
        name: document.getElementById('status-name').value,
        code: document.getElementById('status-code').value,
    };

    if (!statusData.name || !statusData.code) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statusData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Status added successfully!');
            hideForm('status-form');
            clearStatusForm();
            location.reload();
        } else {
            alert('Failed to add status: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding status:', error);
        alert('Error adding status!');
    }
}

async function handleAddDeviceType(event) {
    event.preventDefault();

    const deviceTypeData = {
        name: document.getElementById('device-type-name').value,
        code: document.getElementById('device-type-code').value,
    };

    if (!deviceTypeData.name || !deviceTypeData.code) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addDeviceType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deviceTypeData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Device type added successfully!');
            hideForm('device-type-form');
            clearDeviceTypeForm();
            location.reload();
        } else {
            alert('Failed to add device type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding device type:', error);
        alert('Error adding device type!');
    }
}

async function loadDeviceTypesAndDepartments() {
    try {
        const deviceTypesResponse = await fetch(url+'getDeviceTypes.php');
        const deviceTypesResult = await deviceTypesResponse.json();

        const departmentsResponse = await fetch(url+'getDepartments.php');
        const departmentsResult = await departmentsResponse.json();

        if (deviceTypesResult.success && departmentsResult.success) {
            const deviceTypeDropdown = document.getElementById('device-type');
            deviceTypeDropdown.innerHTML = '<option value="">Select Device Type</option>';
            deviceTypesResult.data.forEach(deviceType => {
                const option = document.createElement('option');
                option.value = deviceType.id;
                option.textContent = deviceType.device_type;
                deviceTypeDropdown.appendChild(option);
            });

            const departmentDropdown = document.getElementById('device-department');
            departmentDropdown.innerHTML = '<option value="">Select Department</option>';
            departmentsResult.data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                departmentDropdown.appendChild(option);
            });
        } else {
            alert('Failed to load data: ' + (deviceTypesResult.error || departmentsResult.error));
        }
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data!');
    }
}
document.addEventListener('DOMContentLoaded', loadDeviceTypesAndDepartments);

async function loadIssueFormData() {
    try {
        const [projectsResponse, issueTypesResponse, statusesResponse, prioritiesResponse, departmentsResponse, devicesResponse, usersResponse] = await Promise.all([
            fetch(url+'getProjects.php'),
            fetch(url+'getIssueTypes.php'),
            fetch(url+'getStatuses.php'),
            fetch(url+'getPriorities.php'),
            fetch(url+'getDepartments.php'),
            fetch(url+'getDevices.php'),
            fetch(url+'getUsers.php'),
        ]);

        const projects = await projectsResponse.json();
        const issueTypes = await issueTypesResponse.json();
        const statuses = await statusesResponse.json();
        const priorities = await prioritiesResponse.json();
        const departments = await departmentsResponse.json();
        const devices = await devicesResponse.json();
        const users = await usersResponse.json();

        populateDropdown('issue-project', projects.data);
        populateDropdown('issue-type', issueTypes.data);
        populateDropdown('issue-status', statuses.data);
        populateDropdown('issue-priority', priorities.data);
        populateDropdown('issue-department', departments.data);
        populateDropdown('issue-device', devices.data);
        populateDropdown('issue-registered-by', users.data);
    } catch (error) {
        console.error('Error loading issue form data:', error);
        alert('Error loading issue form data!');
    }
}

function populateDropdown(dropdownId, data) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select ' + dropdownId.replace('issue-', '') + '</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name || item.type || item.status || item.priority || item.device_type || item.email;
        dropdown.appendChild(option);
    });
}
document.addEventListener('DOMContentLoaded', loadIssueFormData);

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
            hideForm('project-form');
            clearProjectForm();
            location.reload();
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
document.getElementById('project-form').addEventListener('submit', handleAddProject);

async function handleAddDevice(event) {
    event.preventDefault();

    const deviceData = {
        name: document.getElementById('device-name').value,
        device_type_id: document.getElementById('device-type').value,
        department_id: document.getElementById('device-department').value,
    };

    if (!deviceData.name || !deviceData.device_type_id || !deviceData.department_id) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addDevice.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deviceData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Device added successfully!');
            hideForm('device-form');
            clearDeviceForm();
            location.reload();
        } else {
            alert('Failed to add device: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding device:', error);
        alert('Error adding device!');
    }
}

async function handleAddIssueType(event) {
    event.preventDefault();

    const issueTypeData = {
        name: document.getElementById('issue-type-name').value,
        code: document.getElementById('issue-type-code').value,
    };

    if (!issueTypeData.name || !issueTypeData.code) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addIssueType.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueTypeData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Issue type added successfully!');
            hideForm('issueType-form');
            clearIssueTypeForm();
            location.reload();
        } else {
            alert('Failed to add issue type: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding issue type:', error);
        alert('Error adding issue type!');
    }
}

async function handleAddPriority(event) {
    event.preventDefault();

    const priorityData = {
        name: document.getElementById('priority-name').value,
        code: document.getElementById('priority-code').value,
    };

    if (!priorityData.name || !priorityData.code) {
        alert('Please fill out all fields.');
        return;
    }

    try {
        const response = await fetch(url+'addPriority.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(priorityData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Priority added successfully!');
            hideForm('priority-form');
            clearPriorityForm();
            location.reload();
        } else {
            alert('Failed to add priority: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding priority:', error);
        alert('Error adding priority!');
    }
}

async function handleAddIssue(event) {
    event.preventDefault();

    const issueData = {
        project_id: document.getElementById('issue-project').value,
        type_id: document.getElementById('issue-type').value,
        subject: document.getElementById('issue-subject').value,
        description: document.getElementById('issue-description').value,
        status_id: document.getElementById('issue-status').value,
        priority_id: document.getElementById('issue-priority').value,
        department_id: document.getElementById('issue-department').value,
        device_id: document.getElementById('issue-device').value,
        createdDate: document.getElementById('issue-date-created').value,
        dueDate: document.getElementById('issue-due-date').value,
        registeredBy: document.getElementById('issue-registered-by').value,
    };

    if (
        !issueData.project_id ||
        !issueData.type_id ||
        !issueData.subject ||
        !issueData.status_id ||
        !issueData.priority_id ||
        !issueData.department_id ||
        !issueData.device_id ||
        !issueData.createdDate ||
        !issueData.dueDate ||
        !issueData.registeredBy
    ) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch(url+'addIssue.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Issue added successfully!');
            hideForm('issue-form');
            clearIssueForm();
            location.reload();
        } else {
            alert('Failed to add issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding issue:', error);
        alert('Error adding issue!');
    }
}

async function loadProjects() {
    try {
        const response = await fetch(url+'getProjects.php');
        const result = await response.json();

        if (result.success) {
            const projectsList = document.getElementById('projects-list');
            if (result.data.length > 0) {
                projectsList.innerHTML = '';
                result.data.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'item-card';
                    projectCard.innerHTML = `
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description available'}</p>
                        <div class="actions">
                            <button class="edit" onclick="editProject(${project.id})">Edit</button>
                            <button class="delete" onclick="deleteProject(${project.id})">Delete</button>
                        </div>
                    `;
                    projectsList.appendChild(projectCard);
                });
            } else {
                projectsList.innerHTML = 'No projects added yet';
            }
        } else {
            alert('Failed to load projects: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Error loading projects!');
    }
}
async function editProject(projectId) {
    try {
        const response = await fetch(url+`getProjectById.php?id=${projectId}`);
        const result = await response.json();

        if (result.success) {
            document.getElementById('project-edit-name').value = result.data.name;
            document.getElementById('project-edit-description').value = result.data.description;
            const projectIdInput = document.createElement('input');
            projectIdInput.type = 'hidden';
            projectIdInput.id = 'project-edit-id';
            projectIdInput.value = projectId;
            document.getElementById('project-edit-form').appendChild(projectIdInput);
            toggleForm('project-edit-form', true);
        } else {
            alert('Failed to load project data: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading project data:', error);
        alert('Error loading project data!');
    }
}

document.getElementById('project-edit-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const projectId = document.getElementById('project-edit-id').value;
    const projectData = {
        name: document.getElementById('project-edit-name').value,
        description: document.getElementById('project-edit-description').value,
    };
    if (!projectData.name) {
        alert('Project name is required.');
        return;
    }

    try {
        const response = await fetch(url+`updateProject.php?id=${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Project updated successfully!');
            hideForm('project-edit-form');
            loadProjects();
        } else {
            alert('Failed to update project: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating project:', error);
        alert('Error updating project!');
    }
});
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
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
            loadProjects();
        } else {
            alert('Failed to delete project: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project!');
    }
}
window.addEventListener('load', loadProjects);

async function loadIssues(showAll = false) {
    try {
        const response = await fetch(url+'getIssues.php');
        const result = await response.json();

        if (result.success) {
            const issuesList = document.getElementById('issues-list');
            issuesList.innerHTML = '<div class="issues-grid"></div>';
            const issuesGrid = issuesList.querySelector('.issues-grid');
            const issuesToDisplay = showAll ? result.data : result.data.slice(0, 3);
            issuesToDisplay.forEach(issue => {
                const issueCard = document.createElement('div');
                issueCard.className = 'issue-card';
                issueCard.innerHTML = `
                    <h3>${issue.subject}</h3>
                    <div class="details">
                        <p><strong>Project:</strong> ${issue.project_name}</p>
                        <p><strong>Type:</strong> ${issue.type_name}</p>
                        <p><strong>Status:</strong> ${issue.status_name}</p>
                        <p><strong>Priority:</strong> ${issue.priority_name}</p>
                        <p><strong>Department:</strong> ${issue.department_name}</p>
                        <p><strong>Device:</strong> ${issue.device_name}</p>
                        <p><strong>Created:</strong> ${issue.createdDate}</p>
                        <p><strong>Due:</strong> ${issue.dueDate}</p>
                        <p><strong>Registered By:</strong> ${issue.registered_by_name}</p>
                    </div>
                    <div class="description">
                        <p>${issue.description || 'No description available'}</p>
                    </div>
                    <div class="actions">
                        <button class="edit" onclick="editIssue(${issue.id})">Edit</button>
                        <button class="delete" onclick="deleteIssue(${issue.id})">Delete</button>
                    </div>
                `;
                issuesGrid.appendChild(issueCard);
            });
            if (!showAll && result.data.length > 3) {
                const viewAllButton = document.createElement('button');
                viewAllButton.className = 'button view-all';
                viewAllButton.textContent = 'View All';
                viewAllButton.onclick = () => loadIssues(true);
                issuesList.appendChild(viewAllButton);
            }
        } else {
            alert('Failed to load issues: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading issues:', error);
        alert('Error loading issues!');
    }
}
function editIssue(issueId) {
    loadIssueData(issueId);
}
window.addEventListener('load', () => loadIssues(false));

async function loadIssueData(issueId) {
    try {
        await loadDropdowns();
        const response = await fetch(url+`getIssueById.php?id=${issueId}`);
        const result = await response.json();

        if (result.success) {
            populateEditForm(result.data);
            toggleForm('issue-edit-form', true);
        } else {
            alert('Failed to load issue data: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading issue data:', error);
        alert('Error loading issue data!');
    }
}
function populateEditForm(issue) {
    document.getElementById('issue-edit-project').value = issue.project_id;
    document.getElementById('issue-edit-subject').value = issue.subject;
    document.getElementById('issue-edit-description').value = issue.description;
    document.getElementById('issue-edit-type').value = issue.type_id;
    document.getElementById('issue-edit-status').value = issue.status_id;
    document.getElementById('issue-edit-priority').value = issue.priority_id;
    document.getElementById('issue-edit-department').value = issue.department_id;
    document.getElementById('issue-edit-device').value = issue.device_id;
    document.getElementById('issue-edit-date-created').value = issue.createdDate;
    document.getElementById('issue-edit-due-date').value = issue.dueDate;
    document.getElementById('issue-edit-registered-by').value = issue.registeredBy;

    const issueIdInput = document.createElement('input');
    issueIdInput.type = 'hidden';
    issueIdInput.id = 'issue-edit-id';
    issueIdInput.value = issue.id;
    document.getElementById('issue-edit-form').appendChild(issueIdInput);
}

async function loadDropdowns() {
    try {
        const [projectsResponse, issueTypesResponse, statusesResponse, prioritiesResponse, departmentsResponse, devicesResponse, usersResponse] = await Promise.all([
            fetch(url+'getProjects.php'),
            fetch(url+'getIssueTypes.php'),
            fetch(url+'getStatuses.php'),
            fetch(url+'getPriorities.php'),
            fetch(url+'getDepartments.php'),
            fetch(url+'getDevices.php'),
            fetch(url+'getUsers.php'),
        ]);

        const projects = await projectsResponse.json();
        const issueTypes = await issueTypesResponse.json();
        const statuses = await statusesResponse.json();
        const priorities = await prioritiesResponse.json();
        const departments = await departmentsResponse.json();
        const devices = await devicesResponse.json();
        const users = await usersResponse.json();

        populateDropdown('issue-edit-project', projects.data);
        populateDropdown('issue-edit-type', issueTypes.data);
        populateDropdown('issue-edit-status', statuses.data);
        populateDropdown('issue-edit-priority', priorities.data);
        populateDropdown('issue-edit-department', departments.data);
        populateDropdown('issue-edit-device', devices.data);
        populateDropdown('issue-edit-registered-by', users.data);
    } catch (error) {
        console.error('Error loading dropdown data:', error);
        alert('Error loading dropdown data!');
    }
}

async function handleEditIssueFormSubmit(event) {
    event.preventDefault();
    const issueId = document.getElementById('issue-edit-id').value;
    const issueData = {
        project_id: document.getElementById('issue-edit-project').value,
        type_id: document.getElementById('issue-edit-type').value,
        subject: document.getElementById('issue-edit-subject').value,
        description: document.getElementById('issue-edit-description').value,
        status_id: document.getElementById('issue-edit-status').value,
        priority_id: document.getElementById('issue-edit-priority').value,
        department_id: document.getElementById('issue-edit-department').value,
        device_id: document.getElementById('issue-edit-device').value,
        createdDate: document.getElementById('issue-edit-date-created').value,
        dueDate: document.getElementById('issue-edit-due-date').value,
        registeredBy: document.getElementById('issue-edit-registered-by').value,
    };
    if (
        !issueData.project_id ||
        !issueData.type_id ||
        !issueData.subject ||
        !issueData.status_id ||
        !issueData.priority_id ||
        !issueData.department_id ||
        !issueData.device_id ||
        !issueData.createdDate ||
        !issueData.dueDate ||
        !issueData.registeredBy
    ) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        const response = await fetch(url+`updateIssue.php?id=${issueId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issueData),
        });

        const result = await response.json();

        if (result.success) {
            alert('Issue updated successfully!');
            hideForm('issue-edit-form');
            loadIssues();
        } else {
            alert('Failed to update issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating issue:', error);
        alert('Error updating issue!');
    }
}
document.getElementById('issue-edit-form').addEventListener('submit', handleEditIssueFormSubmit);

function deleteIssue(issueId) {
    if (confirm('Are you sure you want to delete this issue?')) {
        handleDeleteIssue(issueId);
    }
}
async function handleDeleteIssue(issueId) {
    try {
        const response = await fetch(url+`deleteIssue.php?id=${issueId}`, {
            method: 'DELETE',
        });
        const rawResponse = await response.text();
        console.log('Raw Response:', rawResponse);
        const result = JSON.parse(rawResponse);

        if (result.success) {
            alert('Issue deleted successfully!');
            loadIssues();
        } else {
            alert('Failed to delete issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        alert('Error deleting issue!');
    }
}

function clearIssueForm() {
    document.getElementById('issue-project').value = '';
    document.getElementById('issue-subject').value = '';
    document.getElementById('issue-description').value = '';
    document.getElementById('issue-type').value = '';
    document.getElementById('issue-status').value = '';
    document.getElementById('issue-priority').value = '';
    document.getElementById('issue-department').value = '';
    document.getElementById('issue-device').value = '';
    document.getElementById('issue-date-created').value = '';
    document.getElementById('issue-due-date').value = '';
    document.getElementById('issue-registered-by').value = '';
}
document.getElementById('issue-form').addEventListener('submit', handleAddIssue);

function clearPriorityForm() {
    document.getElementById('priority-name').value = '';
    document.getElementById('priority-code').value = '';
}
document.getElementById('priority-form').addEventListener('submit', handleAddPriority);

function clearIssueTypeForm() {
    document.getElementById('issue-type-name').value = '';
    document.getElementById('issue-type-code').value = '';
}
document.getElementById('issueType-form').addEventListener('submit', handleAddIssueType);

function clearDeviceForm() {
    document.getElementById('device-name').value = '';
    document.getElementById('device-type').value = '';
    document.getElementById('device-department').value = '';
}
document.getElementById('device-form').addEventListener('submit', handleAddDevice);

function clearDeviceTypeForm() {
    document.getElementById('device-type-name').value = '';
    document.getElementById('device-type-code').value = '';
}
document.getElementById('device-type-form').addEventListener('submit', handleAddDeviceType);

function clearStatusForm() {
    document.getElementById('status-name').value = '';
    document.getElementById('status-code').value = '';
}
document.getElementById('status-form').addEventListener('submit', handleAddStatus);

function clearDepartmentForm() {
    document.getElementById('department-name').value = '';
    document.getElementById('department-code').value = '';
}
document.getElementById('department-form').addEventListener('submit', handleAddDepartment);

function clearUserForm() {
    document.getElementById('user-name').value = '';
    document.getElementById('user-abbreviation').value = '';
    document.getElementById('user-role').value = '';
}
document.getElementById('user-form').addEventListener('submit', handleAddUser);


function viewIssueSearchSection() {
    const searchSection = document.getElementById('search-issues-section');
    searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideSearchSection() {
    document.getElementById('search-issues-section').style.display = 'none';
}

async function loadSearchDropdowns() {
    try {
        const [projectsResponse, departmentsResponse, statusesResponse, prioritiesResponse] = await Promise.all([
            fetch(url+'getProjects.php'),
            fetch(url+'getDepartments.php'),
            fetch(url+'getStatuses.php'),
            fetch(url+'getPriorities.php'),
        ]);

        const projects = await projectsResponse.json();
        const departments = await departmentsResponse.json();
        const statuses = await statusesResponse.json();
        const priorities = await prioritiesResponse.json();

        populateDropdown('search-project', projects.data);
        populateDropdown('search-department', departments.data);
        populateDropdown('search-status', statuses.data);
        populateDropdown('search-priority', priorities.data);
    } catch (error) {
        console.error('Error loading dropdowns:', error);
        alert('Error loading dropdowns!');
    }
}
document.getElementById('search-issues-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const searchCriteria = {
        project_id: document.getElementById('search-project').value,
        department_id: document.getElementById('search-department').value,
        status_id: document.getElementById('search-status').value,
        priority_id: document.getElementById('search-priority').value,
        due_date: document.getElementById('search-due-date').value,
        subject: document.getElementById('search-subject').value.trim(),
    };

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(searchCriteria)) {
        if (value) {
            queryParams.append(key, value);
        }
    }

    try {
        const response = await fetch(url+`searchIssues.php?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
            displaySearchResults(result.data);
        } else {
            alert('Failed to search issues: ' + result.error);
        }
    } catch (error) {
        console.error('Error searching issues:', error);
        alert('Error searching issues!');
    }
});

function displaySearchResults(issues) {
    const tbody = document.querySelector('#issues-table tbody');
    tbody.innerHTML = '';

    if (issues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No issues found.</td></tr>';
        return;
    }

    issues.forEach(issue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${issue.project_name}</td>
            <td>${issue.subject}</td>
            <td>${issue.department_name}</td>
            <td>${issue.issue_status}</td>
            <td>${issue.issue_priority}</td>
            <td>${issue.dueDate}</td>
        `;
        tbody.appendChild(row);
    });
}

window.addEventListener('load', loadSearchDropdowns);
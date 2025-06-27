const url= base_url;
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
    console.log(issueData)

    if (
        !issueData.project_id ||
        !issueData.type_id ||
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
            clearIssueForm();
            await fetch('notify.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ issue_id: result.issue_id })
            });

        } else {
            alert('Failed to add issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding issue:', error);
        alert('Error adding issue!');
    }
}

function goBack() {
    window.location.href= "issues.html";
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
    if(dropdownId == 'issue-department'){
        const newOption = document.createElement('option');
        newOption.value = 'new';
        newOption.textContent = '(New)';
        dropdown.appendChild(newOption);
    }
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name || item.type || item.status || item.priority || item.device_type || item.email;
        dropdown.appendChild(option);
    });
}
$(document).ready(function() {
    $('#issue-device').select2({
        placeholder: "Select Device",
    });
});

async function reloadNewDepartments() {
    try {
        const response = await fetch(url+'getDepartments.php');
        const departments = await response.json();
        populateDropdown('issue-department', departments.data);
    } catch (error) {
        console.error('Error loading issue form data:', error);
        alert('Error loading issue form data!');
    }
}
document.getElementById('issue-department').addEventListener('change', function () {
    if (this.value === 'new') {
        openDepartmentModal();
    }
});
function openDepartmentModal() {
    const modal = document.getElementById('department-modal');
    modal.style.display = 'flex';
}
function closeDepartmentModal() {
    reloadNewDepartments();
    const modal = document.getElementById('department-modal');
    modal.style.display = 'none';
    document.getElementById('department-form').reset();
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
            closeDepartmentModal();
        } else {
            alert('Failed to add department: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Error adding department!');
    }
}

window.onload = function () {
    loadIssueFormData();
};
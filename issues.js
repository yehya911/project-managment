const url= base_url;
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

async function loadIssues() {
    try {
        const response = await fetch(url+'getIssues.php');
        const result = await response.json();

        if (result.success) {
            const issuesList = document.getElementById('issues-list');
            if (result.data.length > 0) {
                issuesList.innerHTML = '';
                result.data.forEach(issue => {
                    const issueCard = document.createElement('div');
                    issueCard.className = 'item-card';
                    issueCard.setAttribute('data-priority', issue.priority_name);
                    issueCard.innerHTML = `
                        <div class= "issue-information">
                            <p><strong>Project: </strong><span class="project">${issue.project_name}</span>.</p>
                            <p><strong>Name: </strong>${issue.subject}.</p>
                            <p><strong>Department: </strong><span class="department">${issue.department_name}</span>.</p>
                            <p><strong>Status: </strong><span class="status">${issue.status_name}</span>.</p>
                            <p><strong>Priority: </strong>${issue.priority_name}.</p>
                            <p><strong>Registered by: </strong><span class="user">${issue.registered_by_name}</span>.</p>                            
                        </div>
                    `;
                    issueCard.addEventListener('click', () => {
                        editIssue(issue.id);
                    });
                    issuesList.appendChild(issueCard);
                });
            } else {
                issuesList.innerHTML = 'No issues added yet';
            }
        } else {
            alert('Failed to load issues: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading issues:', error);
        alert('Error loading issues!');
    }
}
window.addEventListener('load', () => loadIssues());

function trackIssue() {
    const issueId = document.getElementById('issue-edit-id').value;
    window.location.href = `trackIssue.html?id=${issueId}`;
}

function editIssue(issueId) {
    loadIssueData(issueId);
}
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
    document.getElementById('issue-edit-id').value = issue.id;
    document.getElementById('issue-edit-project').value = issue.project_id;
    document.getElementById('issue-edit-subject').value = issue.subject;
    document.getElementById('issue-edit-description').value = issue.description;
    document.getElementById('issue-edit-type').value = issue.type_id;
    document.getElementById('issue-edit-status').value = issue.status_id;
    document.getElementById('issue-edit-priority').value = issue.priority_id;
    document.getElementById('issue-edit-department').value = issue.department_id;
    $('#issue-edit-device').val(issue.device_id).trigger('change');
    document.getElementById('issue-edit-date-created').value = issue.createdDate;
    document.getElementById('issue-edit-due-date').value = issue.dueDate;
    document.getElementById('issue-edit-registered-by').value = issue.registeredBy;
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
function populateDropdown(dropdownId, data, selectedId = '') {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select ' + dropdownId.replace('issue-search-', '') + '</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name || item.type || item.status || item.priority;
        if (item.id == selectedId) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    });
    if(dropdownId == 'issue-edit-device'){
        $(document).ready(function () {
            const $dropdown = $('#' + dropdownId);
            $dropdown.select2({
                placeholder: "Select " + dropdownId.replace('issue-edit-', ''),
            });
        });
    }
}
function hideForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'none';
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
            clearFilters();
        } else {
            alert('Failed to update issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating issue:', error);
        alert('Error updating issue!');
    }
}
document.getElementById('issue-edit-form').addEventListener('submit', handleEditIssueFormSubmit);

function deleteIssue() {
    const issueId = document.getElementById('issue-edit-id').value;
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
        const result = JSON.parse(rawResponse);
        if (result.success) {
            alert('Issue deleted successfully!');
            loadIssues();
            clearFilters();
            hideForm('issue-edit-form');
        } else {
            alert('Failed to delete issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        alert('Error deleting issue!');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const projectInput = document.querySelector('.project-select');
    const departmentInput = document.querySelector('.department-select');
    const statusInput = document.querySelector('.status-select');
    const userInput = document.querySelector('.user-select');
    const cancelButton = document.querySelector('.search-cancel');

    projectInput.addEventListener('change', filterIssues);
    departmentInput.addEventListener('change', filterIssues);
    statusInput.addEventListener('change', filterIssues);
    userInput.addEventListener('change', filterIssues);
    cancelButton.addEventListener('click', clearFilters);
});

function filterIssues() {
    const projectValue = document.querySelector('.project-select');
    const departmentValue = document.querySelector('.department-select');
    const statusValue = document.querySelector('.status-select');
    const userValue = document.querySelector('.user-select');

    const selectedprojectValue = projectValue.selectedIndex > 0 ? projectValue.options[projectValue.selectedIndex].text.trim().toLowerCase() : "";
    const selecteddepartmentValue = departmentValue.selectedIndex > 0 ? departmentValue.options[departmentValue.selectedIndex].text.trim().toLowerCase() : "";
    const selectedstatusValue = statusValue.selectedIndex > 0 ? statusValue.options[statusValue.selectedIndex].text.trim().toLowerCase() : "";
    const selecteduserValue = userValue.selectedIndex > 0 ? userValue.options[userValue.selectedIndex].text.trim().toLowerCase() : "";
    const issues = document.querySelectorAll('.item-card');
    issues.forEach(issue => {
        const project = issue.querySelector('.project')?.textContent.trim().toLowerCase();
        const department = issue.querySelector('.department')?.textContent.trim().toLowerCase();
        const status = issue.querySelector('.status')?.textContent.trim().toLowerCase();
        const user = issue.querySelector('.user')?.textContent.trim().toLowerCase();

        const matchesProject = !selectedprojectValue || project === selectedprojectValue;
        const matchesdepartment = !selecteddepartmentValue || department === selecteddepartmentValue;
        const matchesStatus = !selectedstatusValue || status === selectedstatusValue;
        const matchesUser = !selecteduserValue || user === selecteduserValue;
        issue.style.display = (matchesProject && matchesdepartment && matchesStatus && matchesUser) ? "block" : "none";
    });
}
document.addEventListener("DOMContentLoaded", function () {
    populateSelect(url+"getProjects.php", "issue-search-project");
    populateSelect(url+"getStatuses.php", "issue-search-status");
    populateSelect(url+"getDepartments.php", "issue-search-department");
    populateSelect(url+"getUsers.php", "issue-search-user");
});
async function populateSelect(url, dropdown) {
    const response= await fetch(url);
    const result= await response.json();
    const data= result.data;
    populateDropdown(dropdown, data);
}
function clearFilters() {
    document.querySelector('.project-select').value = '';
    document.querySelector('.department-select').value = '';
    document.querySelector('.status-select').value = '';
    document.querySelector('.user-select').value = '';
    filterIssues();
}
function addIssue(){
    window.location.href = `addIssue.html`;
}

function generateReport() {
    fetchStatusIssues();
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
async function fetchStatusIssues() {
    try {
        const projectId = document.getElementById('issue-search-project').value;
        const departmentId = document.getElementById('issue-search-department').value;
        const userId = document.getElementById('issue-search-user').value;

        const report_url = new URL(url+'getReportBody.php');
        const params = new URLSearchParams();

        if (projectId) params.append('project', projectId);
        if (departmentId) params.append('department', departmentId);
        if (userId) params.append('user', userId);

        const response = await fetch(`${report_url}?${params.toString()}`);
        const data = await response.json();
        fillStatusTables(data);
    } catch (error) {
        console.error('Error fetching status issues:', error);
    }
}
function fillStatusTables(data) {
    const reportContainer = document.getElementById('report-body');
    reportContainer.innerHTML = '';
    const statusSelect = document.getElementById('issue-search-status');
    const selectedStatus = statusSelect.options[statusSelect.selectedIndex].text;
    const filteredTracking = data.issueTracking.filter(tracking => {
        return selectedStatus === "Search Status" || tracking.status === selectedStatus;
    });
    if (data.issueTracking.length > 0) {
        const trackingTable = `
            <h3 class="statusHeading">Issue Tracking</h3>
            <table>
                <tr>
                    <th>Issue Subject</th>
                    <th>Maintenance</th>
                    <th>Supplier</th>
                    <th>Cost</th>
                    <th>Working Time</th>
                </tr>
                ${data.issueTracking.map(tracking => {
                    let workingTime = isNaN(tracking.working_date) 
                        ? tracking.working_date 
                        : `${tracking.working_date} Days`;
                    return `
                    <tr>
                        <td>${tracking.issue_subject}</td>
                        <td>${tracking.maintenance_type}</td>
                        <td>${tracking.supplier_name}</td>
                        <td>$${tracking.cost}</td>
                        <td>${workingTime}</td>
                    </tr>
                `}).join('')}
            </table>
        `;
        reportContainer.innerHTML += trackingTable;
    }
    // for (const [status, issues] of Object.entries(data.issuesByStatus)) {
    //     if(issues.length == 0) continue;
    //     if (selectedStatus !== "Select status" && status !== selectedStatus) continue;
    //     const statusTable = `
    //         <h3 class="statusHeading">${status}</h3>
    //         <table>
    //             <tr>
    //                 <th>Subject</th>
    //                 <th>Project</th>
    //                 <th>Department</th>
    //                 <th>Type</th>
    //                 <th>Issued By</th>
    //                 <th>Device</th>
    //                 <th>Creation Date</th>
    //                 <th>Due Date</th>
    //             </tr>
    //             ${issues.map(issue => `
    //                 <tr>
    //                     <td>${issue.subject}</td>
    //                     <td>${issue.project}</td>
    //                     <td>${issue.department}</td>
    //                     <td>${issue.type}</td>
    //                     <td>${issue.registered_by}</td>
    //                     <td>${issue.device}</td>
    //                     <td>${issue.createdDate}</td>
    //                     <td>${issue.dueDate}</td>
    //                 </tr>
    //             `).join('')}
    //         </table>
    //     `;
    //     reportContainer.innerHTML += statusTable;
    // }
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

// async function fetchReportInfo() {
//     try {
//     const response = await fetch(url+'getIssueReportSummary.php');
//     const data = await response.json();
//     fillReportTable(data);
//     } catch (error) {
//     console.error('Error fetching data:', error);
//     }
// }
// function fillReportTable(data) {
//     const tableBody = document.getElementById('report-summary');
//     const numDepartments = Object.keys(data.departments).length;
//     tableBody.innerHTML = `
//         <tr>
//             <th rowspan="2">Total Issues</th>
//             <th colspan="${numDepartments}">Departments</th>
//             ${Object.keys(data.statuses).map(status => `<th rowspan="2">${status}</th>`).join('')}
//             <th rowspan="2">Total Cost</th>
//         </tr>
//         <tr>
//             ${Object.keys(data.departments).map(department => `<th>${department}</th>`).join('')}
//         </tr>
//         <tr>
//             <td>${data.total_issues}</td>
//             ${Object.keys(data.departments).map(department => `<td>${data.departments[department].issue_count}</td>`).join('')}
//             ${Object.keys(data.statuses).map(status => `<td>${data.statuses[status].issue_count}</td>`).join('')}
//             <td>$${data.total_cost}</td>
//         </tr>
//     `;
// }
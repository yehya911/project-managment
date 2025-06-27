const url= base_url;
async function loadProjects() {
    try {
        const response = await fetch(url+'getProjects.php');
        const result = await response.json();
        if (result.success) {
            const projectsList = document.getElementById('project-list');
            if (result.data.length > 0) {
                projectsList.innerHTML = '';
                result.data.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'item-card';
                    projectCard.innerHTML = `
                    <div class="card-container">
                        <div>
                            <h3>${project.name}</h3>
                            <p>${project.description || 'No description available'}</p>
                        </div>
                    </div>
                    `;
                    projectCard.addEventListener('click', () => {
                        loadProjectIssues(project.id);
                    });
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

async function loadIssues() {
    try {
        const response = await fetch(url+'getIssues.php');
        const result = await response.json();
        if (result.success) {
            const issuesList = document.getElementById('issue-list');
            if (result.data.length > 0) {
                issuesList.innerHTML = '';
                result.data.forEach(issue => {
                    const issueCard = document.createElement('div');
                    issueCard.className = 'issue-item-card';
                    issueCard.setAttribute('data-priority', issue.priority_name);
                    issueCard.setAttribute('data-status', issue.status_name);
                    issueCard.innerHTML = `
                        <div class= "issue-information">
                            <p><strong>Project: </strong>${issue.project_name}.</p>
                            <p><strong>Name: </strong>${issue.subject}.</p>
                            <p><strong>Department: </strong>${issue.department_name}.</p>
                            <p><strong>Status: </strong>${issue.status_name}.</p>
                            <p><strong>Priority: </strong>${issue.priority_name}.</p>
                        </div>
                    `;
                    issueCard.addEventListener('click', () => {
                        openIssueModal(issue);
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
async function openIssueModal(issue) {
    loadIssueData(issue.id);
    document.getElementById('issue-modal').style.display = 'flex';
}
async function loadIssueData(issueId) {
    try {
        await loadDropdowns();
        const response = await fetch(url+`getIssueById.php?id=${issueId}`);
        const result = await response.json();
        if (result.success) {
            populateEditForm(result.data);
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
$(document).ready(function() {
    $('#issue-edit-device').select2({
        placeholder: "Select Device",
    });
});
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
            closeIssueModal();
            loadIssues();
            fetchStatuses();
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
    if (confirm('Are you sure you want to delete this issue?')) {
        handleDeleteIssue();
    }
}
async function handleDeleteIssue() {
    const issueId = document.getElementById('issue-edit-id').value;
    try {
        const response = await fetch(url+`deleteIssue.php?id=${issueId}`, {
            method: 'DELETE',
        });
        const rawResponse = await response.text();
        const result = JSON.parse(rawResponse);

        if (result.success) {
            alert('Issue deleted successfully!');
            closeIssueModal();
            loadIssues();
            fetchStatuses();
        } else {
            alert('Failed to delete issue: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        alert('Error deleting issue!');
    }
}

async function loadProjectIssues(id) {
    try {
        const response = await fetch(url+`searchIssuesByProject.php?id=${id}`);
        const result = await response.json();
        if (result.success) {
            const title = document.getElementById('project-issue-list-title');
            const issuesList = document.getElementById('project-issue-list');
            if (result.data.length > 0) {
                title.innerHTML= `${result.data[0].project_name} Issues`;
                issuesList.innerHTML = '';
                result.data.forEach(issue => {
                    const issueCard = document.createElement('div');
                    issueCard.className = 'project-issue-item-card';
                    issueCard.setAttribute('data-priority', issue.priority_name);
                    issueCard.setAttribute('data-status', issue.status_name);
                    issueCard.innerHTML = `
                        <div class= "issue-information">
                            <p><strong>Project: </strong>${issue.project_name}.</p>
                            <p><strong>Name: </strong>${issue.subject}.</p>
                            <p><strong>Department: </strong>${issue.department_name}.</p>
                            <p><strong>Status: </strong>${issue.status_name}.</p>
                            <p><strong>Priority: </strong>${issue.priority_name}.</p>
                        </div>
                    `;
                    issueCard.addEventListener('click', () => {
                        openIssueModal(issue);
                    });
                    issuesList.appendChild(issueCard);
                });
            } else {
                issuesList.innerHTML = 'No issues added yet';
            }
            showProjectIssuesList(id);
        } else {
            alert('Failed to load issues: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading issues:', error);
        alert('Error loading issues!');
    }
}
function showProjectIssuesList(id) {
    const otherList = document.getElementById('issues-list');
    const issuesList = document.getElementById('project-issues-list');

    if (!issuesList.classList.contains('hidden')) {
        issuesList.classList.add('hidden');
        otherList.classList.remove('hidden');
        fetchStatuses();
    } else {
        otherList.classList.add('hidden');
        issuesList.classList.remove('hidden');
        fetchProjectStatuses(id);
    }
}

function closeIssueModal() {
    document.getElementById('issue-modal').style.display = 'none';
}
function selectedIssueTrack() {
    const issueId = document.getElementById('issue-edit-id').value;
    window.location.href = `trackIssue.html?id=${issueId}`;
}
function addIssue(){
    window.location.href = `addIssue.html`;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchStatuses();
});

function fetchStatuses() {
    fetch(url+"getStatuses.php")
        .then(response => response.json())
        .then(data => {
            const statusContainer = document.querySelector(".status-labels");
            const statusBar = document.querySelector(".status-bar");
            statusContainer.innerHTML = "";
            statusBar.innerHTML = "";
            let totalIssues = data.data.reduce((sum, status) => sum + Number(status.count || 0), 0);
            data.data.forEach(status => {
                const count = status.count || 0;
                const status_name = status.status.toLowerCase().replace(/\s+/g, "-"); 

                const statusItem = document.createElement("div");
                statusItem.classList.add("status-item");

                const label = document.createElement("span");
                label.textContent = status.status;

                const button = document.createElement("button");
                button.classList.add("status-count");
                button.id = status_name;
                button.textContent = count;

                statusItem.appendChild(label);
                statusItem.appendChild(button);
                statusContainer.appendChild(statusItem);
                if (totalIssues > 0) {
                    const statusSegment = document.createElement("div");
                    statusSegment.classList.add("status");
                    statusSegment.classList.add(status_name);
                    statusSegment.style.width = `${(count / totalIssues) * 100}%`;
                    statusBar.appendChild(statusSegment);
                }

                button.addEventListener("click", function () {
                    let selectedStatus = status.status;
                    filterIssues(selectedStatus);
                });
            });
        })
        .catch(error => console.error("Error fetching statuses:", error));
}
let currentFilter = null;
function filterIssues(status) {
    const issueItems = document.querySelectorAll(".issue-item-card");
    if (currentFilter === status) {
        issueItems.forEach(item => {
            item.style.display = "block";
        });
        currentFilter = null;
    } else {
        issueItems.forEach(item => {
            item.style.display = (item.dataset.status === status || status === "all") ? "block" : "none";
        });
        currentFilter = status;
    }
}
function fetchProjectStatuses(projectId) {
    fetch(url+`getProjectStatuses.php?id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.data)
            const statusContainer = document.querySelector(".status-labels");
            const statusBar = document.querySelector(".status-bar");
            statusContainer.innerHTML = "";
            statusBar.innerHTML = "";
            let totalIssues = data.data.reduce((sum, status) => sum + Number(status.count || 0), 0);
            data.data.forEach(status => {
                const count = status.count || 0;
                const status_name = status.status.toLowerCase().replace(/\s+/g, "-"); 

                const statusItem = document.createElement("div");
                statusItem.classList.add("status-item");

                const label = document.createElement("span");
                label.textContent = status.status;

                const button = document.createElement("button");
                button.classList.add("status-count");
                button.id = status_name;
                button.textContent = count;

                statusItem.appendChild(label);
                statusItem.appendChild(button);
                statusContainer.appendChild(statusItem);
                if (totalIssues > 0) {
                    const statusSegment = document.createElement("div");
                    statusSegment.classList.add("status");
                    statusSegment.classList.add(status_name);
                    statusSegment.style.width = `${(count / totalIssues) * 100}%`;
                    statusBar.appendChild(statusSegment);
                }

                button.addEventListener("click", function () {
                    let selectedStatus = status.status;
                    filterProjectIssues(selectedStatus);
                });
            });
        })
        .catch(error => console.error("Error fetching statuses:", error));
}
let projectIssueFilter = null;
function filterProjectIssues(status) {
    const issueItems = document.querySelectorAll(".project-issue-item-card");
    if (projectIssueFilter === status) {
        issueItems.forEach(item => {
            item.style.display = "block";
        });
        projectIssueFilter = null;
    } else {
        issueItems.forEach(item => {
            item.style.display = (item.dataset.status === status || status === "all") ? "block" : "none";
        });
        projectIssueFilter = status;
    }
}

document.getElementById("project-management").addEventListener("click", function() {
    window.location.href = "projects.html";
});
document.getElementById("issue-management").addEventListener("click", function() {
    window.location.href = "issues.html";
});
document.getElementById("asset-management").addEventListener("click", function() {
    window.location.href = "assetList.html";
});
document.getElementById("issue-tracking-title").addEventListener("click", function() {
    window.location.href = "trackIssue.html";
});

async function loadAssetData(){
    try {
        const response = await fetch(url+'getAssetsCount.php');
        const data = await response.json();

        document.getElementById('total-assets').textContent = data.totalAssets;
    } catch (error) {
        console.error('Error fetching assets data:', error);
    }
}
function assetList(){
    window.location.href= 'assetList.html';
}
function addAsset(){
    window.location.href= 'addAsset.html';
}

function fetchIssueList() {
    fetch(url+'getIssues.php')
        .then(response => response.json())
        .then(data => {
            if (data.error || !data.data || data.data.length === 0) {
                document.getElementById('container').innerHTML = `
                    <div class="no-issues">
                        No issues available
                    </div>`;
            } else {
                const issueListHTML = data.data.slice(0,5).map(issue => `
                    <div class="issue-edit-card">
                        <div class="issue-info">
                            <span class="issue-subject">${issue.subject}</span>
                            <p>${issue.project_name}</p>
                        </div>
                        <button class="track-btn" onclick="trackIssue(${issue.id})">Track</button>
                    </div>
                `).join('');
                document.getElementById('container').innerHTML = `
                    <div class="issue-card" id="issueDetails">
                        <div class="issue-list-container">  
                            <div class="issue-list">
                                ${issueListHTML}
                            </div>
                        </div>
                    </div>`;
            }
        }).catch(error => {
            console.error('Error fetching issues:', error);
            document.getElementById('issueDetails').innerHTML = `
                <div class="error-message">
                    Error loading issues
                </div>`;
    });
}
function trackIssue(issueId) {
    window.location.href = `trackIssue.html?id=${issueId}`;
}

window.onload = function () {
    loadAssetData();
    loadProjects();
    loadIssues();
    fetchIssueList();
};
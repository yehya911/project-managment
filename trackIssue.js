const url= base_url;
function getIssueDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');

    if (issueId) {
        fetch(url+`trackIssue.php?id=${issueId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('container').innerHTML = `
                    <div class="issue-card" id="issueDetails">
                        <div class="detail-row">
                            <div class="detail-value">${data.error}</div>
                            <button onclick="AddTrackingData()" style="margin: 0;">Add</button>
                        </div>
                    </div>`;
                } else {
                    displayIssueDetails(data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching issue details:', error);
                document.getElementById('container').innerHTML = `
                <div class="issue-card" id="issueDetails">
                    <div class="detail-row">
                        <div class="detail-value">Error fetching data</div>
                    </div>
                </div>`;
            });
    } else {
        fetchIssueList();
    }
}
function fetchIssueList() {
    const projectDropdown = `
        <div class="project-filter">
            <label for="projectSelect">Filter by Project:</label>
            <select id="projectSelect" onchange="filterIssuesByProject()">
                <option value="">Search By Projects</option>
            </select>
        </div>`;
    fetch(url+'getIssues.php')
        .then(response => response.json())
        .then(data => {
            if (data.error || !data.data || data.data.length === 0) {
                document.getElementById('container').innerHTML = `
                    <div class="no-issues">
                        No issues available
                    </div>`;
            } else {
                const issueListHTML = data.data.map(issue => `
                    <div class="issue-edit-card">
                        <div class="issue-info">
                            <span class="issue-subject">${issue.subject}</span>
                            <p>${issue.project_name}</p>
                        </div>
                        <button class="track-btn" onclick="trackIssue(${issue.id})">Track</button>
                    </div>
                `).join('');
                document.getElementById('container').innerHTML = `
                    ${projectDropdown}
                    <div class="issue-card" id="issueDetails">
                        <div class="issue-list-container">  
                            <div class="issue-list">
                                ${issueListHTML}
                            </div>
                        </div>
                    </div>`;
                    loadSearchDropdowns();
            }
        })
        .catch(error => {
            console.error('Error fetching issues:', error);
            document.getElementById('issueDetails').innerHTML = `
                <div class="error-message">
                    Error loading issues
                </div>`;
        });
}
function trackIssue(issueId) {
    window.location.href = `?id=${issueId}`;
}
function stopTracking() {
    window.location.href = `trackIssue.html`;
}
function filterIssuesByProject() {
    const projectSelect = document.getElementById('projectSelect');
    const selectedProjectId = projectSelect.value;
    const selectedProjectName = selectedProjectId 
        ? projectSelect.options[projectSelect.selectedIndex].text.trim()
        : "";
    const issueListContainer = document.querySelector('.issue-list');
    if (!issueListContainer) return;
    const issueCards = issueListContainer.querySelectorAll('.issue-edit-card');
    issueCards.forEach(card => {
        const projectName = card.querySelector('p')?.textContent.trim();
        if (!selectedProjectId || projectName === selectedProjectName) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
function displayIssueDetails(data) {
    const issueDetails = document.getElementById('issueDetails');

    issueDetails.dataset.id = data.id;
    issueDetails.dataset.maintenanceId = data.maintenance_id;
    issueDetails.dataset.supplierId = data.supplier_id;

    const details = [
        { label: 'Issue Subject', value: data.issue_subject },
        { label: 'Issue Project', value: data.project_name },
        { label: 'Maintenance Type', value: data.maintenance_type },
        { label: 'Supplier', value: data.supplier_name },
        { label: 'Cost', value: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(data.cost) },
        { label: 'Working Time', value: data.working_date ? `${data.working_date} Days` : 'Issue Still Open' }
    ];

    const detailsHTML = details.map(detail => `
        <div class="detail-row">
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value" id="${detail.label}">${detail.value}</div>
        </div>
    `).join('');

    issueDetails.innerHTML = `
        ${detailsHTML}
        <div class="btn-container">
            <button class="btn-primary" onclick="openBillFilesModal(${data.id})">Bill files</button>
            <div class="actions">
                <button onclick="editTrackingData()" class="btn-primary">Edit</button>
                <button onclick="stopTracking()">Back</button>
            </div>
        </div>
    `;
}

function editTrackingData() {
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');
    if (issueId) {
        fetch(url+`trackIssue.php?id=${issueId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('issueDetails').innerHTML = `
                        <div class="detail-row">
                            <div class="detail-value">${data.error}</div>
                            <button onclick="AddTrackingData()" style="margin: 0;">Add</button>
                        </div>`;
                } else {
                    displayIssueDetailsEdit(data.data);
                }
            })
            .catch(error => {
                console.error('Error fetching issue details:', error);
                document.getElementById('issueDetails').innerHTML = `
                    <div class="detail-row">
                        <div class="detail-value">Error fetching data</div>
                    </div>`;
            });
    } else {
        document.getElementById('issueDetails').innerHTML = `
            <div class="detail-row">
                <div class="detail-value">No issue ID provided</div>
            </div>`;
    }
}
function displayIssueDetailsEdit(data) {
    const issueDetails = document.getElementById('issueDetails');
    issueDetails.innerHTML = `
        <input type="hidden" id="edit-id" value="${data.id}">
        <div class="detail-row">
            <div class="detail-label">Issue Subject</div>
            <div class="detail-value">${data.issue_subject}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Issue Project</div>
            <div class="detail-value">${data.project_name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Maintenance Type</div>
            <div class="detail-value">
                <select id="maintenanceType-edit" class="form-control">
                    <option value="${data.maintenance_id}" selected>${data.maintenance_type}</option>
                </select>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Supplier</div>
            <div class="detail-value">
                <select id="supplier-edit" class="form-control">
                    <option value="${data.supplier_id}" selected>${data.supplier_name}</option>
                </select>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Cost</div>
            <div class="detail-value">
                <input type="number" id="cost-edit" class="form-control" value="${Math.floor(data.cost)}">
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Working Time</div>
            <div class="detail-value">
                <input type="number" id="workingDate-edit" class="form-control" value="${data.working_date || ''}">
            </div>
        </div>
        <div class="detail-bill-row">
            <div class= "d-flex">
                <div class="detail-bill-label">Upload New Bill</div>
                <div class="detail-bill-value">
            </div>
                <input type="file" id="bill-file-edit" class="form-control">
            </div>
        </div>
        <div class="actions">
            <button onclick="submitTrackingEditData()" class="btn-primary">Save</button>
            <button onclick="cancelEdit()" class="btn-secondary">Close</button>
        </div>
    `;
    loadEditDropdowns();
}

function submitTrackingEditData() {
    const id = document.getElementById('edit-id').value;
    const maintenanceId = document.getElementById('maintenanceType-edit').value;
    const supplierId = document.getElementById('supplier-edit').value;
    const cost = document.getElementById('cost-edit').value;
    const workingDate = document.getElementById('workingDate-edit').value;
    const billFileInput = document.getElementById('bill-file-edit');

    if (!id || !maintenanceId || !supplierId) {
        alert("All fields except Working Date are required!");
        return;
    }

    const formData = new FormData();
    formData.append('maintenance_id', maintenanceId);
    formData.append('supplier_id', supplierId);
    formData.append('cost', cost);
    formData.append('working_date', workingDate);

    if (billFileInput.files.length > 0) {
        formData.append('bill_file', billFileInput.files[0]);
    }

    fetch(url + `updateTracking.php?id=${id}`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Tracking data updated successfully!");
            getIssueDetails();
            cancelEdit();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to update tracking data.");
    });
}

function AddTrackingData() {
    document.getElementById('addTrackingForm').style.display = 'block';
}
function closeTrackingForm() {
    document.getElementById('addTrackingForm').style.display = 'none';
}
function cancelEdit() {
    getIssueDetails();
}

function submitTrackingData() {
    const issueId = new URLSearchParams(window.location.search).get('id');
    const maintenanceId = document.getElementById('maintenanceType').value;
    const supplierId = document.getElementById('supplier').value;
    const cost = document.getElementById('cost').value;
    const workingDate = document.getElementById('workingDate').value;
    const billFile = document.getElementById('billFile').files[0];

    if (!issueId || !maintenanceId || !supplierId) {
        alert("All fields except Working Date and Cost are required!");
        return;
    }

    const formData = new FormData();
    formData.append("issue_id", issueId);
    formData.append("maintenance_id", maintenanceId);
    formData.append("supplier_id", supplierId);
    formData.append("cost", cost);
    formData.append("working_date", workingDate);
    if (billFile) {
        formData.append("bill_file", billFile);
    }

    fetch(url + "addTracking.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Tracking data added successfully!");
            closeTrackingForm();
            getIssueDetails();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to add tracking data.");
    });
}

async function loadDropdowns() {
    try {
        const [maintenanceResponse, supplierResponse] = await Promise.all([
            fetch(url+'getIssueMaintenance.php'),
            fetch(url+'getIssueSupplier.php'),
        ]);

        const maintenanceTypes = await maintenanceResponse.json();
        const suppliers = await supplierResponse.json();

        populateDropdown('maintenanceType', maintenanceTypes.data);
        populateDropdown('supplier', suppliers.data);
    } catch (error) {
        console.error('Error loading dropdown data:', error);
        alert('Error loading dropdown data!');
    }
}
async function loadEditDropdowns() {
    try {
        const [maintenanceResponse, supplierResponse] = await Promise.all([
            fetch(url+'getIssueMaintenance.php'),
            fetch(url+'getIssueSupplier.php'),
        ]);

        const maintenanceTypes = await maintenanceResponse.json();
        const suppliers = await supplierResponse.json();

        populateDropdown('maintenanceType-edit', maintenanceTypes.data);
        populateDropdown('supplier-edit', suppliers.data);
    } catch (error) {
        console.error('Error loading dropdown data:', error);
        alert('Error loading dropdown data!');
    }
}
async function loadSearchDropdowns() {
    try {
        const response = await fetch(url+'getProjects.php');
        const data = await response.json();

        populateDropdown('projectSelect', data.data);
    } catch (error) {
        console.error(`Error loading data for project search:`, error);
        alert(`Error loading data for project search!`);
    }
}

function populateDropdown(dropdownId, items) {
    const dropdown = document.getElementById(dropdownId);

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.type || item.name;
        dropdown.appendChild(option);
    });
}

function openBillFilesModal(trackingId) {
    const modal = document.getElementById('billFilesModal');
    const container = document.getElementById('billFilesContainer');
    container.innerHTML = '<p>Loading...</p>';
    modal.style.display = 'flex';
    fetch(url+`getBillFiles.php?id=${trackingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.files.length > 0) {
                const links = data.files.map(file => `
                    <div class="bill-entry">
                        <a href="http://192.168.1.155:8080/bills/${file.file_name}" class="bill-link" target="_blank">${file.file_name}</a>
                        <button class="delete-bill-btn" onclick="deleteBillFile('${file.file_name}', ${file.id}, ${trackingId})">Delete</button>
                    </div>
                `).join('');
                container.innerHTML = links;
            } else {
                container.innerHTML = '<p>No bill files available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching bill files:', error);
            container.innerHTML = '<p>Failed to load bill files.</p>';
        });
}
function closeBillFilesModal() {
    document.getElementById('billFilesModal').style.display = 'none';
}

function deleteBillFile(fileName, trackingId, issueId) {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    fetch(url+`deleteBillFile.php?id=${trackingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                openBillFilesModal(issueId);
            } else {
                alert('Failed to delete file: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error deleting file:', error);
            alert('Error deleting file.');
        });
}

document.addEventListener('DOMContentLoaded', loadDropdowns);
document.addEventListener('DOMContentLoaded', getIssueDetails());
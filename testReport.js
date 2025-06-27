const url= base_url;
function generateReport() {
    fetchReportInfo();
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

async function fetchReportInfo() {
    try {
    const response = await fetch(url+'getIssueReportSummary.php');
    const data = await response.json();
    fillReportTable(data);
    } catch (error) {
    console.error('Error fetching data:', error);
    }
}
function fillReportTable(data) {
    const tableBody = document.getElementById('report-summary');
    const numDepartments = Object.keys(data.departments).length;
    tableBody.innerHTML = `
        <tr>
            <th rowspan="2">Total Issues</th>
            <th colspan="${numDepartments}">Departments</th>
            ${Object.keys(data.statuses).map(status => `<th rowspan="2">${status}</th>`).join('')}
            <th rowspan="2">Total Cost</th>
        </tr>
        <tr>
            ${Object.keys(data.departments).map(department => `<th>${department}</th>`).join('')}
        </tr>
        <tr>
            <td>${data.total_issues}</td>
            ${Object.keys(data.departments).map(department => `<td>${data.departments[department].issue_count}</td>`).join('')}
            ${Object.keys(data.statuses).map(status => `<td>${data.statuses[status].issue_count}</td>`).join('')}
            <td>$${data.total_cost}</td>
        </tr>
    `;
}
async function fetchStatusIssues() {
    try {
        const response = await fetch(url+'getReportBody.php');
        const data = await response.json();
        fillStatusTables(data);
    } catch (error) {
        console.error('Error fetching status issues:', error);
    }
}
function fillStatusTables(data) {
    const reportContainer = document.getElementById('report-body');
    reportContainer.innerHTML = '';

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
    for (const [status, issues] of Object.entries(data.issuesByStatus)) {
        const statusTable = `
            <h3 class="statusHeading">${status}</h3>
            <table>
                <tr>
                    <th>Subject</th>
                    <th>Project</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Issued By</th>
                    <th>Device</th>
                    <th>Creation Date</th>
                    <th>Due Date</th>
                </tr>
                ${issues.map(issue => `
                    <tr>
                        <td>${issue.subject}</td>
                        <td>${issue.project}</td>
                        <td>${issue.department}</td>
                        <td>${issue.type}</td>
                        <td>${issue.registered_by}</td>
                        <td>${issue.device}</td>
                        <td>${issue.createdDate}</td>
                        <td>${issue.dueDate}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        reportContainer.innerHTML += statusTable;
    }
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF('p', 'mm', 'a4'); // A4 size PDF in portrait mode

    let reportContent = document.getElementById("report").innerHTML;
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

window.addEventListener('DOMContentLoaded', generateReport);
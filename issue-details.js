const url= base_url;
document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const issueId = params.get("id");

    if (!issueId) {
        document.getElementById("issue-details").innerHTML = "<p class='text-danger'>Issue ID not found!</p>";
        return;
    }

    try {
        const response = await fetch(url+`getIssueDetails.php?id=${issueId}`);
        const issue = await response.json();

        if (!issue.success) {
            document.getElementById("issue-details").innerHTML = `<p class='text-danger'>${issue.error}</p>`;
            return;
        }
        const statusClass = issue.status_name.toLowerCase().replace(/\s+/g, "-");
        const priorityClass = issue.priority_name.toLowerCase().replace(/\s+/g, "-");
        document.getElementById("issue-details").innerHTML = `
            <div class="card shadow p-4">
                <h4 class="mb-3 subject">${issue.subject}</h4>
                <p class="text-muted">${issue.description}</p>
                <hr class="mt-1">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong class="property-title">Project:</strong> ${issue.project_name}</p>
                        <p><strong class="property-title">Type:</strong> ${issue.type_name}</p>
                        <p><strong class="property-title">Status:</strong> <span class="badge ${statusClass}">${issue.status_name}</span></p>
                        <p><strong class="property-title">Priority:</strong> <span class="badge ${priorityClass}">${issue.priority_name}</span></p>
                    </div>
                    <div class="col-md-6">
                        <p><strong class="property-title">Department:</strong> ${issue.department_name}</p>
                        <p><strong class="property-title">Device:</strong> ${issue.device_name}</p>
                        <p><strong class="property-title">Registered By:</strong> ${issue.registered_by_name}</p>
                    </div>
                </div>

                <hr>

                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Created On:</strong> ${issue.createdDate}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Due Date:</strong> ${issue.dueDate}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching issue details:", error);
        document.getElementById("issue-details").innerHTML = "<p class='text-danger'>Error loading issue details.</p>";
    }
});

function trackIssue() {
    const issueId = new URLSearchParams(window.location.search).get("id");
    window.location.href = `trackIssue.html?id=${issueId}`;
}
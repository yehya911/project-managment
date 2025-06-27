function showNotification(message, issueId) {
    var notification = document.createElement("div");
    notification.classList.add("notification");
    
    notification.innerHTML = `
        <a href="issue-details.html?id=${issueId}" class="notification-link">
            <span>${message}</span>
        </a>
        <span class="close-btn" onclick="this.parentElement.remove()">x</span>
    `;
    document.getElementById("notification-container").appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 100);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 30000);
}
document.addEventListener("DOMContentLoaded", function () {
    var pusher = new Pusher("bc2dc511ba3503757dd9", { cluster: "ap2" });
    var channel = pusher.subscribe("notifications-channel");

    channel.bind("new-issue", function (data) {
        showNotification(data.message, data.issue_id);
    });
});
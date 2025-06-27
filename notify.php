<?php
require 'vendor/autoload.php';

$pusher = new Pusher\Pusher(
    'bc2dc511ba3503757dd9',
    'fdc32f6226d3bfe2d268',
    '1937085',
    [
        'cluster' => 'ap2',
        'useTLS' => true
    ]
);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get issue ID from the request body (sent from addIssue.js)
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $issueId = isset($data['issue_id']) ? $data['issue_id'] : null;

    // Set notification message
    $message = 'A new issue has been created!';

    // Send notification with issue ID
    $pusher->trigger('notifications-channel', 'new-issue', [
        'message' => $message,
        'issue_id' => $issueId  // Include issue ID
    ]);

    echo json_encode(['success' => true, 'message' => 'Notification sent!']);
}
?>

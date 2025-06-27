<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (
    empty($data['project_id']) ||
    empty($data['type_id']) ||
    empty($data['subject']) ||
    empty($data['status_id']) ||
    empty($data['priority_id']) ||
    empty($data['department_id']) ||
    empty($data['device_id']) ||
    empty($data['createdDate']) ||
    empty($data['dueDate']) ||
    empty($data['registeredBy'])
) {
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit();
}

$sql = "INSERT INTO `Issues` (
    `project_id`, `type_id`, `subject`, `description`, `status_id`, `priority_id`, 
    `department_id`, `device_id`, `createdDate`, `dueDate`, `registeredBy`
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param(
    'iisssiisssi',
    $data['project_id'],
    $data['type_id'],
    $data['subject'],
    $data['description'],
    $data['status_id'],
    $data['priority_id'],
    $data['department_id'],
    $data['device_id'],
    $data['createdDate'],
    $data['dueDate'],
    $data['registeredBy']
);

if ($stmt->execute()) {
    $newIssueId = $conn->insert_id;
    echo json_encode(['success' => true, 'issue_id' => $newIssueId]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
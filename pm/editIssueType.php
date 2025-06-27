<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (empty($data['type']) || empty($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'issue type and issue type ID are required.']);
    exit();
}
$sql = "UPDATE `issue_type` SET `type` = ?, `code` = ? WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('ssi', $data['type'], $data['code'], $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
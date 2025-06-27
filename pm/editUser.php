<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (empty($data['name']) || empty($data['id']) || empty($data['role'])) {
    echo json_encode(['success' => false, 'error' => 'user name and user ID are required.']);
    exit();
}
$sql = "UPDATE `user` SET `name` = ?, `role_id` = ? WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('sii', $data['name'], $data['role'], $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (empty($data['name']) || empty($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'department name and department ID are required.']);
    exit();
}
$sql = "UPDATE `department` SET `name` = ?, `code` = ? WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('ssi', $data['name'], $data['code'], $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
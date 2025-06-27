<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (empty($data['name']) || empty($data['id']) || empty($data['department_id']) || empty($data['type_id'])) {
    echo json_encode(['success' => false, 'error' => 'device name and device ID are required.']);
    exit();
}
$sql = "UPDATE `Device` SET `name` = ?, `department_id` = ?, `device_type_id` = ? WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('siii', $data['name'], $data['department_id'], $data['type_id'], $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
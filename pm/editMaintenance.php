<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (empty($data['maintenance']) || empty($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Maintenance name and maintenance ID are required.']);
    exit();
}
$sql = "UPDATE `Maintenance` SET `type` = ?, `code` = ? WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('ssi', $data['maintenance'], $data['code'], $data['id']);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
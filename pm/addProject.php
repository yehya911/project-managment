<?php
require 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['name'])) {
    echo json_encode(['success' => false, 'error' => 'Project name is required.']);
    exit();
}

$sql = "INSERT INTO `Project` (`name`, `description`) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ss', $data['name'], $data['description']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
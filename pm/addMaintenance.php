<?php
include 'connection.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['name']) || empty($data['code'])) {
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit();
}

$sql = "INSERT INTO `Maintenance` (`type`, `code`) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare the SQL statement: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ss', $data['name'], $data['code']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to execute the SQL statement: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
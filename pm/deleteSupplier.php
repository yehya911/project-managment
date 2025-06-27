<?php
require 'connection.php';

$priorityId = $_GET['id'];

$sql = "DELETE FROM supplier WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    $error = 'Failed to prepare the SQL statement: ' . $conn->error;
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$stmt->bind_param('i', $priorityId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    $error = 'Failed to execute the SQL statement: ' . $stmt->error;
    echo json_encode(['success' => false, 'error' => $error]);
}

$stmt->close();
$conn->close();
?>
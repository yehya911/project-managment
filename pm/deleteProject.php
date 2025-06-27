<?php
require 'connection.php';

$projectId = $_GET['id'];

$sql = "DELETE FROM Project WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    $error = 'Failed to prepare the SQL statement: ' . $conn->error;
    echo json_encode(['success' => false, 'error' => $error]);
    exit();
}

$stmt->bind_param('i', $projectId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    $error = 'Failed to execute the SQL statement: ' . $stmt->error;
    echo json_encode(['success' => false, 'error' => $error]);
}

$stmt->close();
$conn->close();
?>
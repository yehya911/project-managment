<?php
require 'connection.php';

$assetId = $_GET['id'];
$sql = "DELETE FROM assets WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('i', $assetId);
$stmt->execute();
if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
$stmt->close();
$conn->close();
?>

<?php
require 'connection.php';

$categoryId = $_GET['id'];
$sql = "DELETE FROM asset_category WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Failed to prepare SQL statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param('i', $categoryId);
$stmt->execute();
if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
$stmt->close();
$conn->close();
?>

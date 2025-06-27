<?php
require 'connection.php';

$trackingId = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($trackingId <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid tracking ID.']);
    exit();
}

$stmt = $conn->prepare("SELECT id, file_name FROM tracking_bill WHERE tracking_id = ?");
$stmt->bind_param("i", $trackingId);
$stmt->execute();
$result = $stmt->get_result();

$files = [];
while ($row = $result->fetch_assoc()) {
    $files[] = [
        'id' => $row['id'],
        'file_name' => $row['file_name']
    ];
}

echo json_encode([
    'success' => true,
    'files' => $files
]);

$stmt->close();
$conn->close();
<?php
require 'connection.php';

$billId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($billId <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid bill file ID.']);
    exit();
}

$stmt = $conn->prepare("SELECT file_name FROM tracking_bill WHERE id = ?");
$stmt->bind_param('i', $billId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $fileName = $row['file_name'];
    $originalPath = 'Z:/' . $fileName;
    $deletedPath = 'Z:/deletedBills/' . $fileName;

    // Move the file to the deletedBills folder
    if (file_exists($originalPath)) {
        if (!rename($originalPath, $deletedPath)) {
            echo json_encode(['success' => false, 'error' => 'Failed to move file to deletedBills.']);
            exit();
        }
    }
} else {
    echo json_encode(['success' => false, 'error' => 'File not found in database.']);
    exit();
}

$stmt->close();

$stmt = $conn->prepare("DELETE FROM tracking_bill WHERE id = ?");
$stmt->bind_param('i', $billId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
<?php
include 'connection.php';

$issueId = intval($_POST['issue_id']);
$maintenanceId = intval($_POST['maintenance_id']);
$supplierId = intval($_POST['supplier_id']);
$cost = intval($_POST['cost']);
$workingDate = isset($_POST['working_date']) && $_POST['working_date'] !== '' ? intval($_POST['working_date']) : NULL;

// Insert into issue_tracking
$sql = "INSERT INTO issue_tracking (issue_id, maintenance_id, supplier_id, cost, working_date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param('iiiis', $issueId, $maintenanceId, $supplierId, $cost, $workingDate);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'error' => 'Insert failed: ' . $stmt->error]);
    exit();
}
$trackingId = $stmt->insert_id;
$stmt->close();

// Handle optional file
if (!empty($_FILES['bill_file']) && $_FILES['bill_file']['error'] === UPLOAD_ERR_OK) {
    $fileName = basename($_FILES['bill_file']['name']);

    $uploadDir = 'Z:/';
    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES['bill_file']['tmp_name'], $targetPath)) {
        echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file.']);
        exit();
    }

    $stmt2 = $conn->prepare("INSERT INTO tracking_bill (tracking_id, file_name) VALUES (?, ?)");
    if (!$stmt2) {
        echo json_encode(['success' => false, 'error' => 'Prepare bill insert failed: ' . $conn->error]);
        exit();
    }
    $stmt2->bind_param('is', $trackingId, $fileName);
    if (!$stmt2->execute()) {
        echo json_encode(['success' => false, 'error' => 'Bill insert failed: ' . $stmt2->error]);
        exit();
    }
    $stmt2->close();
}

$conn->close();
echo json_encode(['success' => true]);
?>

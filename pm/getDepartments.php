<?php
include 'connection.php';

$sql = "SELECT id, name FROM Department";
$result = $conn->query($sql);

if ($result) {
    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $departments]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch departments: ' . $conn->error]);
}

$conn->close();
?>
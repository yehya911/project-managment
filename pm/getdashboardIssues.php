<?php
require 'connection.php';

$sql = "
    SELECT 
        subject, 
        description, 
        dueDate
    FROM Issues
    ORDER BY dueDate ASC
";

$result = $conn->query($sql);

if ($result) {
    $issues = [];
    while ($row = $result->fetch_assoc()) {
        $issues[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $issues]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch issues: ' . $conn->error]);
}

$conn->close();
?>

<?php
require 'connection.php';

$sql = "SELECT issue_device.id, assets.id, assets.name
            FROM issue_device
            join assets on issue_device.asset_id = assets.id
            order by assets.name";
$result = $conn->query($sql);

if ($result) {
    $devices = [];
    while ($row = $result->fetch_assoc()) {
        $devices[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $devices]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch devices: ' . $conn->error]);
}

$conn->close();
?>
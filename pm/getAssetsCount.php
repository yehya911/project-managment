<?php
include 'connection.php';

$totalAssets = $conn->query("SELECT COUNT(*) AS total_assets FROM assets")->fetch_assoc()['total_assets'];

echo json_encode([
    'totalAssets' => $totalAssets,
]);
?>
<?php
require 'connection.php';
$response = [];
$tables = ['department', 'asset_category', 'asset_type', 'asset_location', 'asset_status', 'asset_condition'];

foreach ($tables as $table) {
    $sql = "SELECT * FROM `$table`";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $response[$table] = $data;
    } else {
        $response[$table] = [];
    }
}
echo json_encode($response);
$conn->close();
?>
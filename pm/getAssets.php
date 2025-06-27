<?php
include 'connection.php';

$sql = "SELECT a.id, a.department_id, category_id, type_id, location_id, room, status_id, condition_id, d.name AS department, a.name AS asset_name, a.brand AS asset_brand, c.description AS asset_category, t.description AS asset_type, a.purchase_date, a.price, l.description AS asset_location, s.description AS asset_status, a.bar_code, `asset_condition`.`description` AS asset_condition, a.serial_number, a.description, a.expected_life, a.warranty FROM assets a JOIN department d ON a.department_id = d.id JOIN asset_category c ON a.category_id = c.id JOIN asset_type t ON a.type_id = t.id JOIN asset_location l ON a.location_id = l.id JOIN asset_status s ON a.status_id = s.id JOIN `asset_condition` ON a.condition_id = `asset_condition`.id";
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($data);
?>
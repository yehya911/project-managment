<?php
include 'connection.php';

$sqlAssets = "SELECT COUNT(*) AS total_assets FROM assets";
$resultAssets = $conn->query($sqlAssets);

$sqlCategories = "SELECT c.description, COUNT(a.id) AS asset_count 
                  FROM asset_category c 
                  LEFT JOIN assets a ON c.id = a.category_id 
                  GROUP BY c.description";
$resultCategories = $conn->query($sqlCategories);

$sqlDepartments = "SELECT d.name, COUNT(a.id) AS asset_count 
                   FROM department d 
                   LEFT JOIN assets a ON d.id = a.department_id 
                   GROUP BY d.name";
$resultDepartments = $conn->query($sqlDepartments);

$sqlInUse = "SELECT COUNT(*) AS in_use FROM assets WHERE status_id = 1";
$resultInUse = $conn->query($sqlInUse);

$sqlInStorage = "SELECT COUNT(*) AS in_storage FROM assets WHERE status_id = 2";
$resultInStorage = $conn->query($sqlInStorage);

$data = array();

if ($resultAssets->num_rows > 0) {
    $row = $resultAssets->fetch_assoc();
    $data['total_assets'] = $row['total_assets'];
} else {
    $data['total_assets'] = 0;
}

$data['categories'] = array();
if ($resultCategories->num_rows > 0) {
    while ($row = $resultCategories->fetch_assoc()) {
        $data['categories'][$row['description']] = $row['asset_count'];
    }
}

$data['departments'] = array();
if ($resultDepartments->num_rows > 0) {
    while ($row = $resultDepartments->fetch_assoc()) {
        $data['departments'][$row['name']] = $row['asset_count'];
    }
}

if ($resultInUse->num_rows > 0) {
    $row = $resultInUse->fetch_assoc();
    $data['in_use'] = $row['in_use'];
} else {
    $data['in_use'] = 0;
}

if ($resultInStorage->num_rows > 0) {
    $row = $resultInStorage->fetch_assoc();
    $data['in_storage'] = $row['in_storage'];
} else {
    $data['in_storage'] = 0;
}

header('Content-Type: application/json');
echo json_encode($data);
?>
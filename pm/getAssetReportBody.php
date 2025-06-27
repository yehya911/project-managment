<?php
include 'connection.php';

$categoryAssets = array();

// Get the department filter if provided
$departmentId = isset($_GET['department']) ? $_GET['department'] : '';

$sqlCategories = "SELECT id, description FROM asset_category";
$resultCategories = $conn->query($sqlCategories);

if ($resultCategories->num_rows > 0) {
    while ($row = $resultCategories->fetch_assoc()) {
        $categoryId = $row['id'];
        $categoryDescription = $row['description'];

        // Modify the SQL query to filter by department if provided
        $sqlAssetsByCategory = "
            SELECT a.id, a.name AS asset_name, a.brand AS asset_brand, d.name AS department, 
                   t.description AS type, a.purchase_date, a.price, 
                   l.description AS location, s.description AS status, 
                   a.expected_life, a.warranty 
            FROM assets a 
            JOIN department d ON a.department_id = d.id 
            JOIN asset_type t ON a.type_id = t.id 
            JOIN asset_location l ON a.location_id = l.id 
            JOIN asset_status s ON a.status_id = s.id 
            WHERE a.category_id = $categoryId
        ";

        // If department filter is set, add it to the query
        if (!empty($departmentId)) {
            $sqlAssetsByCategory .= " AND a.department_id = $departmentId";
        }

        $resultAssetsByCategory = $conn->query($sqlAssetsByCategory);

        $assets = array();
        if ($resultAssetsByCategory->num_rows > 0) {
            while ($assetRow = $resultAssetsByCategory->fetch_assoc()) {
                $assets[] = $assetRow;
            }
        }

        $categoryAssets[$categoryDescription] = $assets;
    }
}

header('Content-Type: application/json');
echo json_encode($categoryAssets);

$conn->close();
?>

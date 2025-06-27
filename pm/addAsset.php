<?php
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $department_id = $data['department'];
    $name = $data['name'];
    $brand = $data['brand'];
    $category_id = $data['category'];
    $type_id = $data['type'];
    $purchase_date = $data['purchase_date'];
    $price = $data['price'];
    $location_id = $data['location'];
    $room = $data['room'];
    $status_id = $data['status'];
    $bar_code = $data['bar_code'];
    $condition_id = $data['condition'];
    $serial_number = $data['serial_number'];
    $description = $data['description'];
    $expected_life = $data['expected_life'];
    $warranty = $data['warranty'];

    $sql = "INSERT INTO assets (department_id, name, brand, category_id, type_id, purchase_date, price, location_id, room, status_id, bar_code, condition_id, serial_number, description, expected_life, warranty) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("issiisdisisissss", $department_id, $name, $brand, $category_id, $type_id, $purchase_date, $price, $location_id, $room, $status_id, $bar_code, $condition_id, $serial_number, $description, $expected_life, $warranty);

    // if ($stmt->execute()) {
    //     echo json_encode(["success" => true]);
    // } else {
    //     echo json_encode(["success" => false, "error" => $stmt->error]);
    // }

    // $stmt->close();
    if ($stmt->execute()) {
        $newAssetId = $conn->insert_id; // Get the newly inserted asset's ID

        // Now insert into issue_device
        $sqlIssueDevice = "INSERT INTO issue_device (asset_id) VALUES (?)";
        $stmt2 = $conn->prepare($sqlIssueDevice);
        $stmt2->bind_param("i", $newAssetId);

        if ($stmt2->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Asset added, but failed to add to issue_device: " . $stmt2->error]);
        }

        $stmt2->close();
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
}

$conn->close();
?>

<?php
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $id = $data['id'];
    $department_id = $data['department'];
    $name = $data['name'];
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
    $sql = "UPDATE assets SET department_id = ?, name = ?, category_id = ?, type_id = ?, purchase_date = ?, price = ?, location_id = ?, room = ?, status_id = ?, bar_code = ?, condition_id = ?, serial_number = ?, description = ?, expected_life = ?, warranty = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("isiisdisisissssi", $department_id, $name, $category_id, $type_id, $purchase_date, $price, $location_id, $room, $status_id, $bar_code, $condition_id, $serial_number, $description, $expected_life, $warranty, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
}

$conn->close();
?>

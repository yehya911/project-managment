<?php
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $department_id= $data['department_id'];
    $location = $data['name'];
    $code = $data['code'];

    $sql = "INSERT INTO asset_location (department_id, description, code) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("iss", $department_id, $location, $code);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "location added successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
}

$conn->close();
?>

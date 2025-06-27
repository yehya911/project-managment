<?php
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $category = $data['name'];
    $code = $data['code'];

    $sql = "INSERT INTO asset_category (description, code) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("ss", $category, $code);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Category added successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
}

$conn->close();
?>

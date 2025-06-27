<?php
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $status = $data['name'];
    $code = $data['code'];

    $sql = "INSERT INTO asset_status (description, code) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    $stmt->bind_param("ss", $status, $code);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "status added successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
}

$conn->close();
?>

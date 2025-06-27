<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectmanager';

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
include 'connection.php';

$projects = $conn->query("SELECT COUNT(*) AS Projects FROM project")->fetch_assoc()['Projects'];

$issues = $conn->query("SELECT COUNT(*) AS Issues FROM issues")->fetch_assoc()['Issues'];

echo json_encode([
    'projects' => $projects,
    'issues' => $issues
]);
?>
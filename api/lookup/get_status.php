<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$response = [
    "success" => false,
    "data"    => [],
    "message" => ""
];

$sql = "SELECT id, status_name, created_at FROM status_tbl ORDER BY id ASC";

if ($result = $conn->query($sql)) {
    $statuses = [];

    while ($row = $result->fetch_assoc()) {
        $statuses[] = $row;
    }

    $response["success"] = true;
    $response["data"]    = $statuses;
} else {
    $response["message"] = "Failed to fetch statuses: " . $conn->error;
}

echo json_encode($response);
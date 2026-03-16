<?php
require_once 'db.php';

header('Content-Type: application/json');

$response = [
    "success" => false,
    "data"    => [],
    "message" => ""
];

$sql = "SELECT id, category_name, created_at FROM categories_tbl ORDER BY category_name ASC";

if ($result = $conn->query($sql)) {
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    $response["success"] = true;
    $response["data"]    = $categories;
} else {
    $response["message"] = "Failed to fetch categories: " . $conn->error;
}

echo json_encode($response);
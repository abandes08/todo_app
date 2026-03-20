<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

$search = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$status = $_GET['status'] ?? '';

$sql = "SELECT s.status_name, COUNT(*) as total
        FROM todos_tbl t
        JOIN status_tbl s ON t.status_id = s.id
        JOIN categories_tbl c ON t.category_id = c.id
        WHERE 1 ";

// if($search) $sql .= " AND t.particulars LIKE '%$search%' ";
// if($category) $sql .= " AND c.category_name = '$category' ";
// if($status) $sql .= " AND s.status_name = '$status' ";

if ($search) {
    $search_safe = $conn->real_escape_string($search);
    $sql .= " AND t.particulars LIKE '%$search_safe%' ";
}

if ($category) {
    $category_safe = $conn->real_escape_string($category);
    $sql .= " AND c.category_name = '$category_safe' ";
}

if ($status) {
    $status_safe = $conn->real_escape_string($status);
    $sql .= " AND s.status_name = '$status_safe' ";
}

$sql .= " GROUP BY s.status_name";

$result = $conn->query($sql);
$data = [];

while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
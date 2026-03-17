<?php

require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

$search = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$status = $_GET['status'] ?? '';

$sql = "SELECT c.category_name, COUNT(t.id) as total
        FROM todos_tbl t
        JOIN categories_tbl c ON t.category_id = c.id
        WHERE 1 ";

if($search) $sql .= " AND t.particulars LIKE '%$search%' ";
if($category) $sql .= " AND c.category_name = '$category' ";
if($status) $sql .= " AND t.status = '$status' ";

$sql .= " GROUP BY c.category_name";
$result = $conn->query($sql);
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
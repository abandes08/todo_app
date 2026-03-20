<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT category_id, COUNT(*) as total
    FROM todos_tbl
    WHERE status_id IN (1, 2)
    GROUP BY category_id
    ";

    $result = $conn->query($sql);
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[$row['category_id']] = (int)$row['total'];
    }

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
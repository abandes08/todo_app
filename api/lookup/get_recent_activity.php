<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT task, status_id, created_at, updated_at
    FROM todos_tbl
    ORDER BY updated_at DESC
    LIMIT 8
    ";

    $result = $conn->query($sql);
    $activities = [];

    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            "task" => $row['task'],
            "status" => $row['status_id'],
            "time" => $row['updated_at'] ?? $row['created_at']
        ];
    }

    echo json_encode([
        "status" => 'success',
        "activities" => $activities
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
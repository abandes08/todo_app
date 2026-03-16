<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

try {
    // Check if an ID is provided
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id > 0) {
        // Fetch a single task
        $stmt = $conn->prepare("
            SELECT 
                id,
                task,
                description,
                category_id,
                status_id,
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
            FROM todos_tbl
            WHERE id = ?
            LIMIT 1
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $task = $result->fetch_assoc();

        if (!$task) {
            echo json_encode([
                "success" => false,
                "message" => "Task not found"
            ]);
            exit;
        }

        echo json_encode([
            "success" => true,
            "data" => $task
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Fetch all tasks (existing logic)
    $sql = "
        SELECT 
            todos_tbl.id,
            todos_tbl.task,
            todos_tbl.description,
            todos_tbl.category_id,
            todos_tbl.status_id,
            categories_tbl.category_name AS category,
            status_tbl.status_name AS status,
            DATE_FORMAT(todos_tbl.created_at, '%Y-%m-%d') AS created_at
        FROM todos_tbl
        LEFT JOIN categories_tbl ON todos_tbl.category_id = categories_tbl.id
        LEFT JOIN status_tbl ON todos_tbl.status_id = status_tbl.id
        ORDER BY todos_tbl.created_at DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $todos = [];
    while ($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $todos
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
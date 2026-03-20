<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

try {
    // Check if an ID is provided
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $category = isset($_GET['category']) ? trim($_GET['category']) : "";
    $status = isset($_GET['status']) ? trim($_GET['status']) : "";

    if ($id > 0) {
        // Fetch a single task
        $sql = $conn->prepare("
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
        $sql->bind_param("i", $id);
        $sql->execute();
        $result = $sql->get_result();
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

    // Fetch all tasks (with optional category filter)
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
    ";

    $conditions = [];
    $params = [];
    $types = "";

    // Category filter
    if (!empty($category)) {
        $conditions[] = "LOWER(categories_tbl.category_name) = LOWER(?)";
        $params[] = $category;
        $types .= "s";
    }

    // Status filter
    if (!empty($status)) {

        if (strtolower($status) === "active") {
            $conditions[] = "status_tbl.status_name IN ('Created', 'In Progress')";
        } else {
            $conditions[] = "LOWER(status_tbl.status_name) = LOWER(?)";
            $params[] = $status;
            $types .= "s";
        }
    }

    // Apply WHERE clause if needed
    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " ORDER BY todos_tbl.created_at DESC";

    $stmt = $conn->prepare($sql);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

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
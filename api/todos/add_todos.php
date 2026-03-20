<?php

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

try {

    $todo = $_POST['task'] ?? '';
    $description = $_POST['description'] ?? '';
    $category_id = $_POST['category_id'] ?? null;

    if (empty($todo)) {
        throw new Exception("Todo is required");
    }

    $status_id = 1; // Default status_id = 1 (Created)
    $sql = "INSERT INTO todos_tbl (task, description, category_id, status_id)
            VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    //Types of string - s (str), i (int), d (double decimal), b (blob) ex. ssii (string, string, int, int)
    $stmt->bind_param("ssii", $todo, $description, $category_id, $status_id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Todo added successfully"
    ]);

} catch (Exception $e) {

    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
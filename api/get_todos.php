<?php

require_once 'db.php';

header('Content-Type: application/json');

try {

    $sql = "
        SELECT 
            todos_tbl.id,
            todos_tbl.task,
            categories_tbl.category_name AS category,
            status_tbl.status_name AS status,
            DATE_FORMAT(todos_tbl.created_at, '%Y-%m-%d') AS created_at
        FROM todos_tbl
        LEFT JOIN categories_tbl 
            ON todos_tbl.category_id = categories_tbl.id
        LEFT JOIN status_tbl 
            ON todos_tbl.status_id = status_tbl.id
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

// } catch (Exception $e) {

//     http_response_code(500);
//     echo json_encode([
//         "success" => false,
//         "message" => "Server error"
//     ]);
// }

// Cathing real error message can be helpful during development.
} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()   // show real error
    ]);

}


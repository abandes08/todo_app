<?php 
    // API endpoint to retrieve tasks for a user.
    require_once 'db.php';

    header('Content-Type: application/json'); // force JSON response

    $result = $conn->query("SELECT id, task, status, DATE(created_at) AS created_at FROM todos_tbl ORDER BY created_at DESC");
    $todos = [];

    while($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }

    echo json_encode($todos);
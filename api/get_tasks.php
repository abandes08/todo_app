<?php 
    // API endpoint to retrieve tasks for a user.
    require_once 'db.php';

    header('Content-Type: application/json'); // force JSON response

    $result = $conn->query("SELECT id, created_at, task, status FROM todos ORDER BY created_at DESC");
    $todos = [];

    while($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }

    echo json_encode($todos);
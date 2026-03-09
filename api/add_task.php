<?php 
    require_once 'db.php';

    // Decode JSON as associative array
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract task and status
    $task = $data['task'];
    $status = $data['status'];

    // Prepare statement for todos table
    $stmt = $conn->prepare("INSERT INTO todos (task, status) VALUES (?, ?)");
    $stmt->bind_param("ss", $task, $status);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding task']);
    }

    $stmt->close();
    $conn->close();
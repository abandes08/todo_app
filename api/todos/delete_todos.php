<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

// Disable PHP warnings/notices in output
ini_set('display_errors', 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Get task ID safely
$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid task ID."
    ]);
    exit;
}

// Delete the task
$stmt = $conn->prepare("DELETE FROM todos_tbl WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Task deleted successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete task."
    ]);
}

$stmt->close();
$conn->close();
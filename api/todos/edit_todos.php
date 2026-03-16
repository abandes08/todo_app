<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

// Disable PHP errors in output to keep JSON clean
ini_set('display_errors', 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

// Safely get POST data
$id          = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$todo        = $_POST['task'] ?? '';
$description = $_POST['description'] ?? '';
$category    = isset($_POST['category_id']) ? (int) $_POST['category_id'] : 0;
$status      = isset($_POST['status_id'])   ? (int) $_POST['status_id']   : 0;

// Validation
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Missing or invalid task ID."]);
    exit;
}

if (trim($todo) === '') {
    // Task is readonly; in case it’s missing, fetch existing value from DB
    $stmt = $conn->prepare("SELECT task FROM todos_tbl WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        echo json_encode(["success" => false, "message" => "Task not found."]);
        exit;
    }
    $todo = $row['task']; // use existing task
    $stmt->close();
}

if ($category <= 0 || $status <= 0) {
    echo json_encode(["success" => false, "message" => "Category and status must be selected."]);
    exit;
}

// Update task
$stmt = $conn->prepare("
    UPDATE todos_tbl
    SET task = ?, description = ?, category_id = ?, status_id = ?, updated_at = NOW()
    WHERE id = ?
");
$stmt->bind_param("ssiii", $todo, $description, $category, $status, $id);

if ($stmt->execute()) {
    $stmt->close();

    // Fetch updated task
    $stmt = $conn->prepare("
        SELECT id, task, description, category_id, status_id
        FROM todos_tbl
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $updatedTask = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully.",
        "data" => $updatedTask
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update task."
    ]);
}

$stmt->close();
$conn->close();
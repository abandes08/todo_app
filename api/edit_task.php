
<?php
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
require_once 'db.php';

header('Content-Type: application/json');

// Ensure request method is PUT (or POST if you prefer)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'], $data['task'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$taskId = (int)$data['id'];
$task   = trim($data['task']);
$status = isset($data['status']) ? trim($data['status']) : null;

// Prepare statement
$stmt = $conn->prepare("UPDATE todos SET task = ?, status = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database prepare failed"]);
    exit;
}

$stmt->bind_param("ssi", $task, $status, $taskId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No rows updated"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Execution failed"]);
}

$stmt->close();
$conn->close();
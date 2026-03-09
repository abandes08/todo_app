<!-- API endpoint to retrieve tasks for a user. -->
<?php 
    include 'db.php';

    $result = $conn->query("SELECT * FROM todo_db ORDER BY id DESC");

    $todos = [];
    while($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }

    echo json_encode($todos);
?>
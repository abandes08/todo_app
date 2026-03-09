<?php

$host = 'localhost';
$username = 'pma_user';
$password = 'StrongPMAPassword123!';
$dbname = 'todo_db';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
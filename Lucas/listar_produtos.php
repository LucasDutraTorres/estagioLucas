<?php
include 'conexao.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM produtos";
$result = $conn->query($sql);

$produtos = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $produtos[] = $row; 
    }
}

echo json_encode($produtos);

$conn->close();
?>
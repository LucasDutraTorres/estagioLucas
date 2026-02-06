<?php
include 'conexao.php'; 

$sql = "SELECT COUNT(*) as total FROM produtos";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(["total" => $row['total']]);
} else {
    echo json_encode(["total" => 0]);
}

$conn->close(); 
?>
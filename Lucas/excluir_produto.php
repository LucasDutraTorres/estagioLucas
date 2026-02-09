<?php
error_reporting(0);
include 'conexao.php';

$id = $_POST['id'] ?? '';

if (!empty($id)) {
    $sql = "DELETE FROM produtos WHERE id = '$id'";
    
    if ($conn->query($sql)) {
        echo "Sucesso: Produto $id excluído.";
    } else {
        echo "Erro ao excluir: " . $conn->error;
    }
} else {
    echo "Erro: ID não recebido.";
}

$conn->close();
?>

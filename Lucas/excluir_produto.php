<?php
error_reporting(0);
include 'conexao.php';

// Agora recebemos o codigodebarras enviado pelo JS
$codigo = $_POST['codigodebarras'] ?? '';

if (!empty($codigo)) {
    // Deletamos usando o código de barras como referência
    $sql = "DELETE FROM produtos WHERE codigodebarras = '$codigo'";
    
    if ($conn->query($sql)) {
        echo "Sucesso: Produto $codigo excluído.";
    } else {
        echo "Erro ao excluir: " . $conn->error;
    }
} else {
    echo "Erro: Código não recebido.";
}

$conn->close();
?>

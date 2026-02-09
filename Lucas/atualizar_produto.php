<?php
include 'conexao.php';

$nome = $_POST['nome'] ?? '';
$codigo = $_POST['codigodebarras'] ?? '';
$preco = $_POST['preco'] ?? 0;
$quantidade = $_POST['quantidade'] ?? 0;

if (!empty($codigo)) {
    $sql = "UPDATE produtos SET 
            nome = '$nome', 
            preco = '$preco', 
            quantidade = '$quantidade' 
            WHERE codigodebarras = '$codigo'";

    if ($conn->query($sql)) {
        echo "Sucesso: Produto atualizado.";
    } else {
        echo "Erro no banco: " . $conn->error;
    }
} else {
    echo "Erro: Código não recebido.";
}
$conn->close();
?>

<?php
// Desativa avisos que podem sujar a resposta
error_reporting(0);
include 'conexao.php';

// Recebe os dados do JavaScript
$id = $_POST['id'] ?? '';
$nome = $_POST['nome'] ?? '';
$codigo = $_POST['codigodebarras'] ?? '';
$preco = $_POST['preco'] ?? 0;
$quantidade = $_POST['quantidade'] ?? 0;

if (!empty($id)) {
    // IMPORTANTE: Verifique se os nomes das colunas abaixo são IGUAIS ao seu banco
    $sql = "UPDATE produtos SET 
            nome = '$nome', 
            codigodebarras = '$codigo', 
            preco = '$preco', 
            quantidade = '$quantidade' 
            WHERE id = '$id'";

    if ($conn->query($sql)) {
        echo "Sucesso: Produto $id atualizado.";
    } else {
        echo "Erro no banco: " . $conn->error;
    }
} else {
    echo "Erro: ID não recebido.";
}

$conn->close();
?>

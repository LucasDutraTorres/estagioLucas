<?php
include 'conexao.php';


$nome = $_POST['nome'] ?? '';
$codigo = $_POST['codigodebarras'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$preco = $_POST['preco'] ?? 0;
$quantidade = $_POST['quantidade'] ?? 0;
$fornecedor = $_POST['fornecedor'] ?? '';


$sql = "INSERT INTO produtos (nome, codigodebarras, categoria, preco, quantidade, fornecedor) 
        VALUES ('$nome', '$codigo', '$categoria', '$preco', '$quantidade', '$fornecedor')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "sucesso", "mensagem" => "Produto salvo com sucesso!"]);
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco: " . $conn->error]);
}

$conn->close();
?>
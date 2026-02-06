<?php
include 'conexao.php';
$dados = json_decode(file_get_contents('php://input'), true);

if ($dados) {
    $sql = "UPDATE produtos SET 
            nome='{$dados['nome']}', 
            codigodebarras='{$dados['codigodebarras']}', 
            preco='{$dados['preco']}', 
            quantidade='{$dados['quantidade']}' 
            WHERE id={$dados['id']}";
    
    if ($conn->query($sql)) echo json_encode(["mensagem" => "Produto atualizado!"]);
    else echo json_encode(["mensagem" => "Erro ao atualizar."]);
}
$conn->close();
?>
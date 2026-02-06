<?php
include 'conexao.php';
$dados = json_decode(file_get_contents('php://input'), true);

if ($dados) {
    $sql = "DELETE FROM produtos WHERE id={$dados['id']}";
    if ($conn->query($sql)) echo json_encode(["mensagem" => "Produto excluído!"]);
    else echo json_encode(["mensagem" => "Erro ao excluir."]);
}
$conn->close();
?>
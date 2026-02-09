<?php
/**
 * Script para Atualização de Produtos
 * 
 * Este arquivo atualiza as informações de um produto existente
 * utilizando o 'codigodebarras' como identificador único.
 */

// Inclui a conexão com o banco de dados
include 'conexao.php';

// Coleta os dados enviados via POST
$nome = $_POST['nome'] ?? '';
$codigo = $_POST['codigodebarras'] ?? '';
$preco = $_POST['preco'] ?? 0;
$quantidade = $_POST['quantidade'] ?? 0;

// Verifica se o código de barras foi fornecido, pois é essencial para localizar o registro
if (!empty($codigo)) {
    // Prepara a query SQL de atualização (UPDATE)
    // Filtra pelo código de barras para garantir que apenas um produto seja alterado
    $sql = "UPDATE produtos SET 
            nome = '$nome', 
            preco = '$preco', 
            quantidade = '$quantidade' 
            WHERE codigodebarras = '$codigo'";

    // Executa a query
    if ($conn->query($sql)) {
        echo "Sucesso: Produto atualizado.";
    } else {
        echo "Erro no banco: " . $conn->error;
    }
} else {
    // Caso o código de barras esteja vazio, retorna um erro
    echo "Erro: Código não recebido.";
}

// Fecha a conexão com o banco de dados
$conn->close();
?>

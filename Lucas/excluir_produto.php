<?php
/**
 * Script para Exclusão de Produtos
 * 
 * Este arquivo remove um produto do banco de dados baseado no seu código de barras.
 */

// Desativa a exibição de erros para o usuário final (pode ser útil em produção, mas cuidado em dev)
error_reporting(0);

// Inclui a conexão com o banco de dados
include 'conexao.php';

// Recebe o código de barras do produto a ser excluído via POST
$codigo = $_POST['codigodebarras'] ?? '';

// Verifica se o código foi enviado
if (!empty($codigo)) {
    // Prepara a query SQL de deleção (DELETE)
    // Importante: Sempre use uma cláusula WHERE para não apagar toda a tabela
    $sql = "DELETE FROM produtos WHERE codigodebarras = '$codigo'";
    
    // Executa a query e verifica o resultado
    if ($conn->query($sql)) {
        echo "Sucesso: Produto $codigo excluído.";
    } else {
        echo "Erro ao excluir: " . $conn->error;
    }
} else {
    // Retorna erro caso o identificador não tenha sido enviado
    echo "Erro: Código não recebido.";
}

// Fecha a conexão com o banco de dados
$conn->close();
?>

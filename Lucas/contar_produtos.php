<?php
/**
 * Script para Contagem de Produtos
 * 
 * Este arquivo retorna o número total de registros na tabela 'produtos'.
 * Útil para exibir estatísticas ou indicadores no painel principal.
 */

// Inclui a conexão com o banco de dados
include 'conexao.php'; 

// Query SQL utilizando a função de agregação COUNT(*) para contar as linhas
$sql = "SELECT COUNT(*) as total FROM produtos";
$result = $conn->query($sql);

// Verifica se a consulta foi executada com sucesso
if ($result) {
    // Extrai o resultado da contagem
    $row = $result->fetch_assoc();
    // Retorna o total em formato JSON
    echo json_encode(["total" => $row['total']]);
} else {
    // Em caso de falha, retorna total como zero
    echo json_encode(["total" => 0]);
}

// Fecha a conexão com o banco de dados
$conn->close(); 
?>

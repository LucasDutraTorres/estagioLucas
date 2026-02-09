<?php
/**
 * Script para Listagem de Produtos
 * 
 * Este arquivo recupera todos os registros da tabela 'produtos' 
 * e os retorna em formato JSON para serem consumidos pelo front-end.
 */

// Inclui a conexão com o banco de dados
include 'conexao.php';

// Define o cabeçalho da resposta como JSON para que o navegador/cliente interprete corretamente
header('Content-Type: application/json');

// Query SQL para selecionar todos os campos de todos os produtos
$sql = "SELECT * FROM produtos";
$result = $conn->query($sql);

// Inicializa um array vazio para armazenar a lista de produtos
$produtos = [];

// Verifica se a consulta retornou algum resultado
if ($result->num_rows > 0) {
    // Percorre cada linha de resultado retornada pelo banco de dados
    while($row = $result->fetch_assoc()) {
        // Adiciona a linha (um array associativo do produto) ao array principal
        $produtos[] = $row; 
    }
}

// Converte o array de produtos para uma string JSON e a exibe
echo json_encode($produtos);

// Fecha a conexão com o banco de dados
$conn->close();
?>

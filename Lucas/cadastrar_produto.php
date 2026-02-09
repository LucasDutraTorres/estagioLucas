<?php
/**
 * Script para Cadastro de Produtos
 * 
 * Este arquivo recebe dados via POST (geralmente de um formulário ou requisição fetch/ajax)
 * e os insere na tabela 'produtos' do banco de dados.
 */

// Inclui o arquivo de conexão para ter acesso à variável $conn
include 'conexao.php';

// Coleta os dados enviados via método POST. 
// O operador '??' define um valor padrão caso o campo não tenha sido enviado.
$nome = $_POST['nome'] ?? '';
$codigo = $_POST['codigodebarras'] ?? '';
$categoria = $_POST['categoria'] ?? '';
$preco = $_POST['preco'] ?? 0;
$quantidade = $_POST['quantidade'] ?? 0;
$fornecedor = $_POST['fornecedor'] ?? '';

// Prepara a query SQL para inserção dos dados na tabela 'produtos'
$sql = "INSERT INTO produtos (nome, codigodebarras, categoria, preco, quantidade, fornecedor) 
        VALUES ('$nome', '$codigo', '$categoria', '$preco', '$quantidade', '$fornecedor')";

// Executa a query e verifica se foi bem-sucedida
if ($conn->query($sql) === TRUE) {
    // Retorna uma resposta em formato JSON indicando sucesso
    echo json_encode(["status" => "sucesso", "mensagem" => "Produto salvo com sucesso!"]);
} else {
    // Retorna uma resposta em formato JSON indicando o erro ocorrido
    echo json_encode(["status" => "erro", "mensagem" => "Erro no banco: " . $conn->error]);
}

// Fecha a conexão com o banco de dados para liberar recursos
$conn->close();
?>

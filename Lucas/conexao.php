<?php
/**
 * Configuração da Conexão com o Banco de Dados
 * 
 * Este arquivo estabelece a ligação entre a aplicação PHP e o banco de Dados MySQL.
 */

// Configurações do servidor de banco de dados
$servidor = "localhost"; // Endereço do servidor (geralmente localhost em ambiente de desenvolvimento)
$usuario = "root";      // Nome de usuário do MySQL
$senha = "";            // Senha do usuário (vazia por padrão no XAMPP/WampServer)
$banco = "controle_de_estoque_arruda"; // Nome da base de dados que será utilizada

// Criação da conexão utilizando a extensão mysqli
$conn = new mysqli($servidor, $usuario, $senha, $banco);

// Verificação de erros na conexão
if ($conn->connect_error) {
    // Se houver erro, encerra a execução e exibe uma mensagem genérica
    die("Erro ao conectar ao banco de dados: " . $conn->connect_error);
}

// Se chegou aqui, a conexão foi estabelecida com sucesso
?>

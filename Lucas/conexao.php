<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "controle_de_estoque_arruda"; 

$conn = new mysqli($servidor, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro");
}

?>
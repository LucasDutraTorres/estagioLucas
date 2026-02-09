/**
 * Lógica de Front-end para Controle de Estoque
 * 
 * Este arquivo contém as funções que gerenciam a interatividade das páginas HTML,
 * incluindo navegação, manipulação do DOM e comunicação com os scripts PHP via Fetch API.
 */

/**
 * Redireciona o usuário para a página principal do sistema (pagina2.html)
 */
function Entrar() {
    window.location.href = "pagina2.html";
}

/**
 * Busca o total de produtos no servidor e exibe um resumo estatístico
 * na área de resultados.
 */
function exibirQuantidade() {
    const area = document.getElementById('areaResultados');
    if (!area) return;

    area.innerHTML = "<p>Consultando...</p>";
    
    // Busca o total de produtos no arquivo PHP
    fetch('../contar_produtos.php')
        .then(response => {
            if (!response.ok) throw new Error('Arquivo PHP não encontrado');
            return response.text(); 
        })
        .then(texto => {
            try {
                const data = JSON.parse(texto); 
                area.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h2>Status do Inventário</h2>
                        <p style="font-size: 24px;">Existem <b>${data.total}</b> itens registrados.</p>
                    </div>
                `;
            } catch (e) {
                console.error("Erro ao converter JSON:", e, "Texto recebido:", texto);
                area.innerHTML = "<p>Erro na leitura dos dados. Verifique o Console (F12).</p>";
            }
        })
        .catch(error => {
            console.error('Erro de conexão:', error);
            area.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
        });
}

/**
 * Gera e exibe dinamicamente o formulário de cadastro de produtos na área de resultados.
 * Também configura o evento de envio (submit) para enviar os dados ao PHP.
 */
function exibirFormularioCadastro() {
    const area = document.getElementById('areaResultados');
    if (area) {
        // Insere o HTML do formulário na div de resultados
        area.innerHTML = `
            <h2 style="margin-bottom: 20px;">Cadastrar Novo Produto</h2>
            <form id="formCadastro" style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 400px; text-align: left;">
                <label><b>Nome do Produto:</b></label>
                <input type="text" name="nome" placeholder="Ex: Maionese Arruda" required>
                <label><b>Código de Barras:</b></label>
                <input type="text" name="codigodebarras" placeholder="0000000000" required>
                <label><b>Categoria:</b></label>
                <select name="categoria" required>
                    <option value="">Selecione...</option>
                    <option value="alimento">Alimento</option>
                    <option value="eletronico">Eletrônico</option>
                    <option value="vestuario">Vestuário</option>
                </select>
                <label><b>Preço Unitário (R$):</b></label>
                <input type="number" step="0.01" name="preco" placeholder="0.00" required>
                <label><b>Quantidade em Estoque:</b></label>
                <input type="number" name="quantidade" placeholder="0" required>
                <label><b>Fornecedor:</b></label>
                <input type="text" name="fornecedor" placeholder="Nome do Fornecedor" required>
                <button type="submit" style="margin-top: 15px; padding: 10px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
                    💾 Salvar Produto
                </button>
            </form>
            <div id="statusCadastro" style="margin-top: 15px; font-weight: bold;"></div>
        `;

        // Adiciona o ouvinte de evento para o envio do formulário
        document.getElementById('formCadastro').addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o recarregamento da página
            const formData = new FormData(this); // Captura os dados do formulário
            
            // Envia os dados para o script PHP via POST
            fetch('cadastrar_produto.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('statusCadastro');
                if(data.status === "sucesso") {
                    statusDiv.style.color = "green";
                    statusDiv.innerHTML = data.mensagem;
                    this.reset(); // Limpa o formulário em caso de sucesso
                } else {
                    statusDiv.style.color = "red";
                    statusDiv.innerHTML = data.mensagem;
                }
            });
        });
    }
}

/**
 * Busca a lista de produtos do servidor e os exibe em uma tabela.
 * Aplica cores de destaque na quantidade baseadas no histórico salvo no localStorage.
 */
function exibirProdutos() {
    const area = document.getElementById('areaResultados');
    
    // Recupera as cores (verde para aumento, vermelho para diminuição) salvas no navegador
    const coresSalvas = JSON.parse(localStorage.getItem('coresEstoque') || '{}');
    console.log("Cores disponíveis para carregar:", coresSalvas);

    // Faz a requisição para listar os produtos
    fetch('../listar_produtos.php')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                area.innerHTML = "<h3>Nenhum produto cadastrado.</h3>";
                return;
            }

            // Inicia a construção da tabela HTML
            let tabela = `
                <h2 style="margin-bottom: 20px;">Produtos em Estoque</h2>
                <table border="1" style="width: 100%; border-collapse: collapse; text-align: left; background-color: white;">
                    <thead style="background-color: #f2f2f2;">
                        <tr>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Código</th>
                            <th style="padding: 10px;">Categoria</th>
                            <th style="padding: 10px;">Preço</th>
                            <th style="padding: 10px;">Qtd</th>
                            <th style="padding: 10px;">Fornecedor</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // Itera sobre cada produto retornado pelo banco
            data.forEach(p => {
                // Define a cor da fonte para a quantidade (padrão preto se não houver histórico)
                const cor = coresSalvas[p.codigodebarras] || 'black';

                tabela += `
                    <tr>
                        <td style="padding: 10px;">${p.nome}</td>
                        <td style="padding: 10px;">${p.codigodebarras}</td>
                        <td style="padding: 10px;">${p.categoria}</td>
                        <td style="padding: 10px;">R$ ${parseFloat(p.preco).toFixed(2)}</td>
                        <td style="padding: 10px; color: ${cor}; font-weight: bold;">
                            ${p.quantidade}
                        </td>
                        <td style="padding: 10px;">${p.fornecedor}</td> 
                    </tr>
                `;
            });
            
            area.innerHTML = tabela + "</tbody></table>";
        })
        .catch(error => {
            console.error('Erro ao carregar:', error);
            area.innerHTML = "<p>Erro ao carregar os produtos.</p>";
        });
}

/**
 * Carrega os produtos em uma tabela editável na página de gerenciamento.
 */
function carregarProdutosParaEdicao() {
    fetch('../listar_produtos.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('listaGerenciamento');
            if (!container) return;
            if (data.length === 0) {
                container.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }
            let html = `<table border="1" style="width: 100%; border-collapse: collapse; background: white;">
                <thead><tr><th>Nome</th><th>Código</th><th>Preço</th><th>Qtd</th><th>Ações</th></tr></thead><tbody>`;
            
            data.forEach(p => {
                html += `<tr id="linha-${p.codigodebarras}">
                    <td><input type="text" class="edit-input" id="nome-${p.codigodebarras}" value="${p.nome}"></td>
                    <td><input type="text" class="edit-input" id="code-${p.codigodebarras}" value="${p.codigodebarras}" readonly></td>
                    <td><input type="number" step="0.01" class="edit-input" id="preco-${p.codigodebarras}" value="${p.preco}"></td>
                    <td><input type="number" class="edit-input" id="qtd-${p.codigodebarras}" value="${p.quantidade}"></td>
                    <td style="padding: 10px; display: flex;">
                        <button class="btn-salvar" onclick="salvarAlteracao('${p.codigodebarras}')">Salvar</button>
                        <button class="btn-excluir" onclick="excluirProduto('${p.codigodebarras}')">Excluir</button>
                    </td>
                </tr>`;
            });
            container.innerHTML = html + "</tbody></table>";
        });
}

/**
 * Coleta os novos dados de um produto editado, compara a quantidade antiga com a nova
 * para definir uma cor de status, e envia a atualização para o servidor.
 */
function salvarAlteracao(codigo) {
    const nome = document.getElementById(`nome-${codigo}`).value;
    const preco = document.getElementById(`preco-${codigo}`).value;
    const inputQtd = document.getElementById(`qtd-${codigo}`);
    
    const novaQtd = parseInt(inputQtd.value);
    // Busca o valor original carregado (usado para comparação de estoque)
    const qtdAntiga = parseInt(inputQtd.getAttribute('value'));

    console.log(`Comparando: Antiga(${qtdAntiga}) vs Nova(${novaQtd})`);

    // Define a cor baseado na mudança de estoque
    let corDefinida = 'black';
    if (novaQtd > qtdAntiga) {
        corDefinida = 'green'; // Aumentou estoque
    } else if (novaQtd < qtdAntiga) {
        corDefinida = 'red';   // Diminuiu estoque
    }

    const formData = new FormData();
    formData.append('codigodebarras', codigo);
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('quantidade', novaQtd);

    // Envia a atualização para o PHP
    fetch('../atualizar_produto.php', { method: 'POST', body: formData })
    .then(response => response.text())
    .then(texto => {
        if (texto.includes("Sucesso")) {
            // Salva a preferência de cor no localStorage para persistir entre recarregamentos
            let coresEstoque = JSON.parse(localStorage.getItem('coresEstoque') || '{}');
            coresEstoque[codigo] = corDefinida;
            localStorage.setItem('coresEstoque', JSON.stringify(coresEstoque));
            
            console.log("Cores no LocalStorage agora:", coresEstoque);
            
            alert("✅ Alterações salvas! ");
            // Atualiza o atributo value para que a próxima edição compare com este novo valor
            inputQtd.setAttribute('value', novaQtd);
        } else {
            alert("❌ Erro: " + texto);
        }
    })
    .catch(error => console.error("Erro no fetch:", error));
}

/**
 * Solicita confirmação e envia uma requisição para excluir o produto do banco de dados.
 */
function excluirProduto(codigo) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        const formData = new FormData();
        formData.append('codigodebarras', codigo);
        
        fetch('../excluir_produto.php', { method: 'POST', body: formData })
        .then(response => response.text())
        .then(texto => {
            if (texto.includes("Sucesso")) {
                alert("✅ Produto excluído!");
                // Remove a linha da tabela sem precisar recarregar a página
                const linha = document.getElementById(`linha-${codigo}`);
                if (linha) linha.remove();
            } else {
                alert("❌ Erro ao excluir: " + texto);
            }
        })
        .catch(error => alert("Erro de conexão."));
    }
}

/**
 * Executa funções automaticamente quando a página termina de carregar.
 */
window.onload = () => {
    // Se estivermos na página que contém a div de gerenciamento, carrega a lista editável
    if (document.getElementById('listaGerenciamento')) {
        carregarProdutosParaEdicao();
    }
};

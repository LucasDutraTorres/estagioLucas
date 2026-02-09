function Entrar() {
    window.location.href = "pagina2.html";
}

function exibirFormularioCadastro() {
    const area = document.getElementById('areaResultados');
    if (area) {
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

        document.getElementById('formCadastro').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('cadastrar_produto.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('statusCadastro');
                if(data.status === "sucesso") {
                    statusDiv.style.color = "green";
                    statusDiv.innerHTML = data.mensagem;
                    this.reset();
                } else {
                    statusDiv.style.color = "red";
                    statusDiv.innerHTML = data.mensagem;
                }
            });
        });
    }
}

function exibirProdutos() {
    const area = document.getElementById('areaResultados');
    
    // Recupera as cores do navegador
    const coresSalvas = JSON.parse(localStorage.getItem('coresEstoque') || '{}');
    console.log("Cores disponíveis para carregar:", coresSalvas);

    fetch('../listar_produtos.php')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                area.innerHTML = "<h3>Nenhum produto cadastrado.</h3>";
                return;
            }

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

            data.forEach(p => {
                // Tentamos buscar a cor pelo código de barras ou pelo ID (caso exista)
                // O console mostrou que as chaves salvas são '6', '10', etc.
                // Então vamos verificar se o código de barras do produto corresponde a alguma chave salva
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

function salvarAlteracao(codigo) {
    const nome = document.getElementById(`nome-${codigo}`).value;
    const preco = document.getElementById(`preco-${codigo}`).value;
    const inputQtd = document.getElementById(`qtd-${codigo}`);
    
    const novaQtd = parseInt(inputQtd.value);
    // Usamos o atributo 'value' que veio do banco de dados originalmente
    const qtdAntiga = parseInt(inputQtd.getAttribute('value'));

    console.log(`Comparando: Antiga(${qtdAntiga}) vs Nova(${novaQtd})`);

    let corDefinida = 'black';
    if (novaQtd > qtdAntiga) {
        corDefinida = 'green';
    } else if (novaQtd < qtdAntiga) {
        corDefinida = 'red';
    }

    const formData = new FormData();
    formData.append('codigodebarras', codigo);
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('quantidade', novaQtd);

    fetch('../atualizar_produto.php', { method: 'POST', body: formData })
    .then(response => response.text())
    .then(texto => {
        if (texto.includes("Sucesso")) {
            // Salva no localStorage
            let coresEstoque = JSON.parse(localStorage.getItem('coresEstoque') || '{}');
            coresEstoque[codigo] = corDefinida;
            localStorage.setItem('coresEstoque', JSON.stringify(coresEstoque));
            
            console.log("Cores no LocalStorage agora:", coresEstoque);
            
            alert("✅ Alterações salvas! ");
            // Atualiza o atributo value para futuras comparações
            inputQtd.setAttribute('value', novaQtd);
        } else {
            alert("❌ Erro: " + texto);
        }
    })
    .catch(error => console.error("Erro no fetch:", error));
}



function excluirProduto(codigo) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        const formData = new FormData();
        formData.append('codigodebarras', codigo);
        fetch('../excluir_produto.php', { method: 'POST', body: formData })
        .then(response => response.text())
        .then(texto => {
            if (texto.includes("Sucesso")) {
                alert("✅ Produto excluído!");
                const linha = document.getElementById(`linha-${codigo}`);
                if (linha) linha.remove();
            } else {
                alert("❌ Erro ao excluir: " + texto);
            }
        })
        .catch(error => alert("Erro de conexão."));
    }
}

window.onload = () => {
    if (document.getElementById('listaGerenciamento')) {
        carregarProdutosParaEdicao();
    }
};

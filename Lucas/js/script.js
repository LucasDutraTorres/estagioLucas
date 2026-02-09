function Entrar() {
    window.location.href= "pagina2.html"
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
                <input type="text" name="codigo_barras" placeholder="0000000000" required>

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

            fetch('../cadastrar_produto.php', {
                method: 'POST',
                body: formData
            })
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
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Erro ao conectar com o servidor.");
            });
        });
    }
}

function exibirQuantidade() {
    const area = document.getElementById('areaResultados');
    area.innerHTML = "<p>Consultando...</p>";

    fetch('../contar_produtos.php')
        .then(response => {
            
            if (!response.ok) throw new Error('Arquivo PHP não encontrado');
            return response.text(); 
        })
        .then(texto => {
            console.log("Resposta bruta do PHP:", texto);
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

function exibirProdutos() {
    const area = document.getElementById('areaResultados');

    fetch('../listar_produtos.php')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                area.innerHTML = "<h3>Nenhum produto cadastrado no momento.</h3>";
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

            data.forEach(produto => {
                tabela += `
                    <tr>
                        <td style="padding: 10px;">${produto.nome}</td>
                        <td style="padding: 10px;">${produto.codigodebarras}</td>
                        <td style="padding: 10px;">${produto.categoria}</td>
                        <td style="padding: 10px;">R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                        <td style="padding: 10px;">${produto.quantidade}</td>
                        <td style="padding: 10px;">${produto.fornecedor}</td> 
                    </tr>
                `;
            });
            
            area.innerHTML = tabela;
        })
        .catch(error => {
            console.error('Erro:', error);
            area.innerHTML = "<p>Erro ao carregar os produtos.</p>";
        });
}

window.onload = carregarProdutosParaEdicao;

function carregarProdutosParaEdicao() {
    fetch('../listar_produtos.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('listaGerenciamento');
            if (data.length === 0) {
                container.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }

            let html = `<table border="1" style="width: 100%; border-collapse: collapse; background: white;">
                <thead>
                    <tr><th>Nome</th><th>Código</th><th>Preço</th><th>Qtd</th><th>Ações</th></tr>
                </thead><tbody>`;

            data.forEach(p => {
                html += `
                    <tr id="linha-${p.id}">
                        <td><input type="text" class="edit-input" id="nome-${p.id}" value="${p.nome}"></td>
                        <td><input type="text" class="edit-input" id="code-${p.id}" value="${p.codigodebarras}"></td>
                        <td><input type="number" step="0.01" class="edit-input" id="preco-${p.id}" value="${p.preco}"></td>
                        <td><input type="number" class="edit-input" id="qtd-${p.id}" value="${p.quantidade}"></td>
                        <td style="padding: 10px; display: flex;">
                            <button class="btn-salvar" onclick="salvarAlteracao(${p.id})">Salvar</button>
                            <button class="btn-excluir" onclick="excluirProduto(${p.id})">Excluir</button>
                        </td>
                    </tr>`;
            });
            html += "</tbody></table>";
            container.innerHTML = html;
        });
}

function salvarAlteracao(id) {
    // Coleta os dados dos inputs
    const nome = document.getElementById(`nome-${id}`).value;
    const code = document.getElementById(`code-${id}`).value;
    const preco = document.getElementById(`preco-${id}`).value;
    const qtd = document.getElementById(`qtd-${id}`).value;

    // Criamos um formulário virtual para enviar
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nome', nome);
    formData.append('codigodebarras', code);
    formData.append('preco', preco);
    formData.append('quantidade', qtd);

    console.log("Tentando salvar produto ID:", id);

    fetch('../atualizar_produto.php', {
        method: 'POST',
        body: formData // Enviando como FormData é o jeito mais seguro
    })
    .then(response => response.text())
    .then(texto => {
        console.log("Resposta Real do PHP:", texto);
        if (texto.includes("Sucesso")) {
            alert("✅ Salvo no Banco de Dados!");
        } else {
            alert("❌ Erro ao salvar: " + texto);
        }
    })
    .catch(error => {
        console.error('Erro de conexão:', error);
        alert("Erro de conexão com o servidor.");
    });
}

function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        fetch('../excluir_produto.php', { // AJUSTE O CAMINHO SE NECESSÁRIO
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: id })
        })
        .then(response => response.text())
        .then(texto => {
            alert("Produto excluído!");
            document.getElementById(`linha-${id}`).remove();
        })
        .catch(error => console.error('Erro:', error));
    }
}

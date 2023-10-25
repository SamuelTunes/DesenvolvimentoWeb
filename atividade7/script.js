// Função para remover linha
function removerLinha(button) {
    button.parentNode.parentNode.remove();
}

// Função para adicionar linha
function adicionarLinha(ra, nome, dataNascimento) {
    var table = document.getElementById("aluno-table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
	
    newRow.innerHTML = `
        <td>${ra}</td>
        <td>${nome}</td>
        <td>${dataNascimento}</td
		<td>(00)00000000-0000</td>
        <td><button>Remover</button></td>
    `;

    newRow.querySelector("button").addEventListener("click", function () {
        removerLinha(this);
    });
}

// Evento de clique do botão de adicionar
document.getElementById("add-button").addEventListener("click", function () {
    var ra = document.getElementById("ra").value;
    var nome = document.getElementById("nome").value;
    var dataNascimento = document.getElementById("dataNascimento").value;

	
    adicionarLinha(ra, nome, dataNascimento);

    document.getElementById("ra").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("dataNascimento").value = "";
});

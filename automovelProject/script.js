// Função para gravar dados no banco de dados Firebase
function gravar() {
  // Obter valores dos campos de entrada
  let brand = document.getElementById("brand").value;
  let model = document.getElementById("model").value;
  let color = document.getElementById("color").value;
  let plate = document.getElementById("plate").value;
  let year = document.getElementById("year").value;
  let mileage = document.getElementById("mileage").value;

  // Criar objeto JSON com os dados a serem gravados
  let jsonBody = {
    fields: {
      marca: {
        stringValue: brand,
      },
      modelo: {
        stringValue: model,
      },
      cor: {
        stringValue: color,
      },
      anoFabri: {
        integerValue: year,
      },
      kmRodado: {
        integerValue: mileage,
      },
    },
  };

  // Configurar as opções para a requisição fetch
  const options = {
    method: "POST",
    body: JSON.stringify(jsonBody),
  };

  // Enviar requisição para gravar dados no banco de dados
  fetch(
    "https://firestore.googleapis.com/v1/projects/automovelsql/databases/(default)/documents/automoveis?documentId=" +
      plate,
    options
  ).then((T) => {
    console.log(T.json);
    // Após gravar, chamar a função de buscar para atualizar a tabela
    buscar();
  });
    removerBotaoSalvar();
          // Limpar campos do formulário após salvar
      document.getElementById("plate").value = "";
      document.getElementById("brand").value = "";
      document.getElementById("model").value = "";
      document.getElementById("color").value = "";
      document.getElementById("year").value = "";
      document.getElementById("mileage").value = "";
}

// Função para buscar dados no banco de dados e atualizar a tabela
function buscar() {
  // Limpar o corpo da tabela
  let corpoTabela = document.getElementById("corpoTabela");
  corpoTabela.innerHTML = "";

  // Enviar requisição para obter dados do banco de dados
  fetch(
    "https://firestore.googleapis.com/v1/projects/automovelsql/databases/(default)/documents/automoveis"
  )
    .then((response) => response.json())
    .then((automoveis) => {
      let n = automoveis.documents.length;

      // Iterar sobre os documentos obtidos e criar linhas na tabela
      for (let i = 0; i < n; i++) {
        (function (c) {
          // IIFE para criar um escopo fechado
          let novaLinha = document.createElement("TR");
          corpoTabela.appendChild(novaLinha);

          // Criar células para cada coluna
          let colPlate = document.createElement("TD");
          let colBrand = document.createElement("TD");
          let colModel = document.createElement("TD");
          let colColor = document.createElement("TD");
          let colYear = document.createElement("TD");
          let colMileage = document.createElement("TD");
          let colEdit = document.createElement("TD");

          // Atribuir IDs às células para facilitar a manipulação posterior
          colBrand.id = `brand_${c.name.split("/")[6]}`;
          colModel.id = `model_${c.name.split("/")[6]}`;
          colColor.id = `color_${c.name.split("/")[6]}`;
          colYear.id = `year_${c.name.split("/")[6]}`;
          colMileage.id = `mileage_${c.name.split("/")[6]}`;

          // Adicionar células à nova linha
          novaLinha.appendChild(colPlate);
          novaLinha.appendChild(colBrand);
          novaLinha.appendChild(colModel);
          novaLinha.appendChild(colColor);
          novaLinha.appendChild(colYear);
          novaLinha.appendChild(colMileage);
          novaLinha.appendChild(colEdit);

          // Preencher células com dados do documento
          colPlate.innerHTML = c.name.split("/")[6];
          colBrand.innerHTML = c.fields.marca.stringValue;
          colModel.innerHTML = c.fields.modelo.stringValue;
          colColor.innerHTML = c.fields.cor.stringValue;
          colYear.innerHTML = c.fields.anoFabri.integerValue;
          colMileage.innerHTML = c.fields.kmRodado.integerValue;

          // Criar botão "Editar" e adicionar evento de clique
          let botaoEdit = document.createElement("button");
          botaoEdit.innerText = "Editar";
          botaoEdit.addEventListener("click", () =>
            editarRegistro(c.name.split("/")[6])
          );
          colEdit.appendChild(botaoEdit);
        })(automoveis.documents[i]);
      }
    });
}

// Função para editar um registro específico
function editarRegistro(idPlate) {
  // Obter valores do registro selecionado
  let newBrand = document.getElementById(`brand_${idPlate}`).innerText;
  let newModel = document.getElementById(`model_${idPlate}`).innerText;
  let newColor = document.getElementById(`color_${idPlate}`).innerText;
  let newYear = document.getElementById(`year_${idPlate}`).innerText;
  let newMileage = document.getElementById(`mileage_${idPlate}`).innerText;

  // Preencher campos do formulário com valores do registro
  document.getElementById("plate").value = idPlate;
  document.getElementById("brand").value = newBrand;
  document.getElementById("model").value = newModel;
  document.getElementById("color").value = newColor;
  document.getElementById("year").value = newYear;
  document.getElementById("mileage").value = newMileage;

  // Remover qualquer botão "Salvar" existente
  removerBotaoSalvar();

  // Criar um novo botão "Salvar" para o registro selecionado
  criarBotaoSalvar(idPlate);
}

// Função para criar um botão "Salvar" para um registro específico
function criarBotaoSalvar(idPlate) {
  // Remover o botão "Salvar" se existir
  removerBotaoSalvar();

  // Criar novo botão "Salvar" e adicionar evento de clique
  let botaoSalvar = document.createElement("button");
  botaoSalvar.innerText = "Salvar";
  botaoSalvar.id = `salvar_${idPlate}`;
  botaoSalvar.style.cursor = "pointer";
  botaoSalvar.addEventListener("click", function () {
    salvarEdicao(idPlate);
  });
  botaoSalvar.classList.add("classeBotaoSalvar");

  // Adicionar o botão à div de botões no formulário
  var divBotoes = document.getElementById("form-grid");
  divBotoes.appendChild(botaoSalvar);
}

// Função para remover todos os botões "Salvar" na página
function removerBotaoSalvar() {
  let botoesSalvar = document.querySelectorAll('[id^="salvar_"]');
  botoesSalvar.forEach((botao) => {
    botao.remove();
  });
}

// Função para salvar as alterações feitas em um registro
function salvarEdicao(idPlate) {
  // Obter novos valores dos campos de entrada
  let newBrand = document.getElementById("brand").value;
  let newModel = document.getElementById("model").value;
  let newColor = document.getElementById("color").value;
  let newYear = document.getElementById("year").value;
  let newMileage = document.getElementById("mileage").value;

  // Criar objeto JSON com os novos dados
  let jsonBody = {
    fields: {
      marca: {
        stringValue: newBrand,
      },
      modelo: {
        stringValue: newModel,
      },
      cor: {
        stringValue: newColor,
      },
      anoFabri: {
        integerValue: newYear,
      },
      kmRodado: {
        integerValue: newMileage,
      },
    },
  };

  // Configurar opções para a requisição fetch
  const options = {
    method: "PATCH",
    body: JSON.stringify(jsonBody),
  };

  // Enviar requisição para salvar alterações no registro
  fetch(
    `https://firestore.googleapis.com/v1/projects/automovelsql/databases/(default)/documents/automoveis/${idPlate}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Registro editado com sucesso:", data);

      // Limpar campos do formulário após salvar
      document.getElementById("plate").value = "";
      document.getElementById("brand").value = "";
      document.getElementById("model").value = "";
      document.getElementById("color").value = "";
      document.getElementById("year").value = "";
      document.getElementById("mileage").value = "";

      // Atualizar a tabela após salvar
      buscar();
    })
    .catch((error) => {
      console.error("Erro ao editar registro:", error);
      alert("Erro ao editar registro. Consulte o console para obter detalhes.");
    });
	removerBotaoSalvar();
}

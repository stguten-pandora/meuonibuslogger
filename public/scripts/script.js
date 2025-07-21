const tabela = document.getElementById("datagrid");
const dados = document.getElementById("consulta");
console.log(dados);


function showLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "none";
}

function formatVeiculoCode(veiculo) {
  return veiculo.toString().length === 5 ?
    veiculo.toString().substr(0, 2).padStart(3, '0') + '.' + veiculo.toString().substr(2).replace('*', '') :
    veiculo.toString().substr(0, 3) + '.' + veiculo.toString().substr(3).replace('*', '');
}

function formatDate() {
  return document.getElementById("data").value || `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`
}

function loadSelector() {
  fetch("/linhas/todas-as-linhas")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("linha");
      for (linha of data) {
        select.add(new Option(linha.nome, linha.codigo));
      }
    });

}

dados.addEventListener("submit", async (event) => {
  event.preventDefault();
  showLoadingScreen();
  tabela.innerHTML = "";

  const linha = document.getElementById("linha").value || '';
  const numeronibus = document.getElementById("numeronibus").value || 0;
  const data = formatDate();

  const resultado = await fetch(`/registros/buscar?data=${data}&linha=${linha}&numeronibus=${numeronibus}`).then((response) => response.json());

  const headers = {
    horario: "Horario",
    veiculo: "Veiculo",
    linha: "Linha",
    tempoChegada: "Minutos",
    posicao: "Posição",
  };

  //Header Code
  const headerRow = document.createElement("tr");
  Object.values(headers).forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  tabela.appendChild(headerRow);

  //Content Code
  resultado.forEach(({ horario, veiculo, sentido, tempochegada, posicao }) => {
    const row = document.createElement("tr");
    Object.entries({
      horario: new Date(horario).toLocaleString().replace(',', '').trim(),
      veiculo: formatVeiculoCode(veiculo),
      linha: sentido.replace("*", ""),
      tempoChegada: `${tempochegada} Minutos`,
      posicao: `<a href="http://maps.google.com/maps?t=k&q=loc:${posicao.toString().replace(",", "+")}">Posição GPS</a>`,
    }).forEach(([_, value]) => {
      const td = document.createElement("td");
      td.innerHTML = value;
      row.appendChild(td);
    });
    tabela.appendChild(row);
  });

  hideLoadingScreen();
});

document.onload = loadSelector();
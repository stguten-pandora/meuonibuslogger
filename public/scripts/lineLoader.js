const selectLinha = document.getElementById("linha");

async function loadSelector() {
    const linhas = await fetch("/linhas/todas-as-linhas").then((response) => response.json());
    for (let linha of linhas) {      
        selectLinha.add(new Option(linha.nome, linha.codigo));
    }
}
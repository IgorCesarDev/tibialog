// script.js
function analisarMensagens() {
    const input = document.getElementById('input-messages').value.trim();
    const resultDiv = document.getElementById('result');

    if (!input) {
        resultDiv.innerHTML = "Por favor, insira mensagens para análise.";
        return;
    }

    const linhas = input.split('\n');
    const contador = {};

    linhas.forEach(linha => {
        const match = linha.match(/\d{2}:\d{2}:\d{2} (.+?) \[\d+\]: (.+)/);
        if (match) {
            const player = match[1];
            const magia = match[2];

            if (!contador[player]) {
                contador[player] = {};
            }

            if (!contador[player][magia]) {
                contador[player][magia] = 0;
            }

            contador[player][magia]++;
        }
    });

    let resultado = "<h3>Resultado:</h3>";
    for (const [player, magias] of Object.entries(contador)) {
        resultado += `<strong>${player}</strong><br>`;
        for (const [magia, quantidade] of Object.entries(magias)) {
            resultado += `- ${magia}: ${quantidade}<br>`;
        }
        resultado += `<br>`;
    }

    resultDiv.innerHTML = resultado;
}

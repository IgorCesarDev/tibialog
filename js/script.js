function contarMagias() {
    const logInput = document.getElementById("logInput").value;
    const lines = logInput.split('\n');
    const magiasPorJogador = {};

    // Para cada linha do log
    lines.forEach(line => {
        // Regex para capturar o nome do jogador com espaços e a magia
        const regex = /\d{2}:\d{2}:\d{2} (.+?) \[\d+\]: (.+)/;
        const match = line.match(regex);
        
        if (match) {
            const jogador = match[1].trim();  // Remover espaços extras ao redor do nome
            const magia = match[2];

            // Se o jogador ainda não existir, cria um objeto para ele
            if (!magiasPorJogador[jogador]) {
                magiasPorJogador[jogador] = {};
            }

            // Se a magia ainda não tiver sido contada, inicializa a contagem
            if (!magiasPorJogador[jogador][magia]) {
                magiasPorJogador[jogador][magia] = 0;
            }

            // Incrementa o contador da magia para o jogador
            magiasPorJogador[jogador][magia]++;
        }
    });

    // Exibe os resultados na tela
    const respostas = document.getElementById("respostas");
    respostas.innerHTML = ''; // Limpa o conteúdo anterior

    for (const jogador in magiasPorJogador) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${jogador}:</strong><ul>`;
        
        // Lista as magias usadas por esse jogador
        for (const magia in magiasPorJogador[jogador]) {
            li.innerHTML += `<li>${magia}: ${magiasPorJogador[jogador][magia]}</li>`;
        }

        li.innerHTML += '</ul>';
        respostas.appendChild(li);
    }
}

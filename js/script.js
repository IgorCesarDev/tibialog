function contarMagias() {
    const logInput = document.getElementById("logInput").value;
    const lines = logInput.split('\n');
    const magiasPorJogador = {};

    let primeiroHorario = null;
    let ultimoHorario = null;

    // Para cada linha do log
    lines.forEach(line => {
        // Regex para capturar o nome do jogador com espaços e a magia
        const regex = /\d{2}:\d{2}:\d{2} (.+?) \[\d+\]: (.+)/;
        const match = line.match(regex);
        
        if (match) {
            const jogador = match[1].trim();  // Remover espaços extras ao redor do nome
            const magia = match[2];
            const horario = match[0].substring(0, 8); // Pega apenas o horário (hh:mm:ss)

            // Atualizar o primeiro horário
            if (!primeiroHorario) {
                primeiroHorario = horario;
            }

            // Sempre atualizar o último horário
            ultimoHorario = horario;

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

    // Função para calcular a diferença entre dois horários
    function calcularTempo(totalInicio, totalFim) {
        const [horaInicio, minutoInicio, segundoInicio] = totalInicio.split(":").map(Number);
        const [horaFim, minutoFim, segundoFim] = totalFim.split(":").map(Number);

        const tempoInicioEmSegundos = horaInicio * 3600 + minutoInicio * 60 + segundoInicio;
        const tempoFimEmSegundos = horaFim * 3600 + minutoFim * 60 + segundoFim;

        const duracaoEmSegundos = tempoFimEmSegundos - tempoInicioEmSegundos;

        const horas = Math.floor(duracaoEmSegundos / 3600);
        const minutos = Math.floor((duracaoEmSegundos % 3600) / 60);
        const segundos = duracaoEmSegundos % 60;

        return `${horas}h ${minutos}m ${segundos}s`;
    }

    // Exibe os resultados na tela
    const respostas = document.getElementById("respostas");
    respostas.innerHTML = ''; // Limpa o conteúdo anterior

    // Calcula e exibe o tempo total do combate
    if (primeiroHorario && ultimoHorario) {
        const tempoCombate = calcularTempo(primeiroHorario, ultimoHorario);
        const tempoElemento = document.createElement('li');
        tempoElemento.innerHTML = `<strong>Tempo do combate:</strong> ${tempoCombate}`;
        respostas.appendChild(tempoElemento);
    }

    // Exibe as magias por jogador
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

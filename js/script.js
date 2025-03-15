async function analisarMensagens() {
    const input = document.getElementById("input-messages").value.trim();
    const resultado = document.getElementById("result");
    resultado.innerHTML = "";
    fetch('./json/cooldowns.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha na requisição: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Dados carregados com sucesso:', data);
    })
    .catch(error => {
      console.error('Erro ao carregar o arquivo JSON:', error);
    });
  
    
    if (!input) {
        resultado.innerHTML = "Por favor, insira algumas mensagens.";
        return;
    }

    // Carrega o arquivo de cooldowns
    const cooldowns = await fetch('json/cooldowns.json').then(res => res.json());

    const linhas = input.split('\n');
    const magiasUsadas = {};

    // Extrai horários e magias
    const horarioInicial = linhas[0].substring(0, 8);
    const horarioFinal = linhas[linhas.length - 1].substring(0, 8);

    const segundosInicio = converterParaSegundos(horarioInicial);
    const segundosFinal = converterParaSegundos(horarioFinal);
    const tempoTotalGameplay = segundosFinal - segundosInicio;

    linhas.forEach(linha => {
        const regex = /: (.*)/;
        const match = linha.match(regex);
        if (match) {
            const magia = match[1].toLowerCase();
            magiasUsadas[magia] = (magiasUsadas[magia] || 0) + 1;
        }
    });

    // Cálculo do aproveitamento
    let tempoTotalMagias = 0;
    for (const magia in magiasUsadas) {
        if (cooldowns[magia]) {
            tempoTotalMagias += cooldowns[magia] * magiasUsadas[magia];
        }
    }

    const aproveitamento = ((tempoTotalMagias / tempoTotalGameplay) * 100).toFixed(2);

    resultado.innerHTML = `
        <p>Tempo total de gameplay: ${formatarTempo(tempoTotalGameplay)}</p>
        <p>Aproveitamento com magias: ${aproveitamento}%</p>
        <h3>Detalhes das magias usadas:</h3>
        <ul>
            ${Object.entries(magiasUsadas).map(([magia, qtd]) => `<li>${magia}: ${qtd}x</li>`).join('')}
        </ul>
    `;
}

function converterParaSegundos(horario) {
    const [horas, minutos, segundos] = horario.split(':').map(Number);
    return horas * 3600 + minutos * 60 + segundos;
}

function formatarTempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
    return `${horas}h ${minutos}m ${segundosRestantes}s`;
}

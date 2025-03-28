function contarMagias() {
    const log = document.getElementById('logInput').value.trim().split('\n');
    const resultado = document.getElementById('respostas');
    resultado.innerHTML = '';
    
    const cooldowns = {
        Knight: {
            Atk: { "exori mas": 6, "exori": 6, "exori min": 6, "exori gran": 6, "exori amp kor": 18 },
            Sup: { "utamo tempo": 10, "utito tempo": 10, "exeta res": 2, "exeta amp res": 2, "utani tempo hur": 2, "utani hur": 2 },
            Heal: { "exura med ico": 1, "exura gran ico": 600, "exura ico": 1 }
        },
        Sorcerer: {
            Atk: { "exevo gran vis lux": 6, "exevo vis hur": 8, "exevo gran mas vis": 40, "exevo gran mas flam": 40 },
            Sup: { "utamo vita": 14, "exori kor": 12, "exori moe": 12, "utani hur": 2, "utani gran hur": 2 },
            Heal: { "exura max vita": 6, "exura vita": 1 }
        },
        Druid: {
            Atk: { "exevo gran frigo hur": 8, "exevo tera hur": 4, "exevo gran mas tera": 40, "exevo gran mas frigo": 40 },
            Sup: { "utani hur": 2, "utani gran hur": 2 },
            Heal: { "exura max vita": 6, "exura vita": 1, "exura sio": 1, "exura gran sio": 60 }
        },
        Paladin: {
            Atk: { "exevo mas san": 4, "exori gran con": 6, "exevo tempo mas san": 26 },
            Sup: { "utito tempo san": 10, "utevo grav san": 32 },
            Heal: { "exura gran san": 1, "exura san": 1 }
        }
    };

    const magiasUsadas = {};
    let tempoInicio = null;
    let tempoFim = null;

    log.forEach(linha => {
        const match = linha.match(/(\d{2}:\d{2}:\d{2})\s(.*?)\s\[\d+\]:\s(.+)/);
        if (match) {
            const [, tempo, jogador, magia] = match;
            if (!tempoInicio) tempoInicio = tempo;
            tempoFim = tempo;

            if (!magiasUsadas[jogador]) {
                magiasUsadas[jogador] = { Atk: {}, Sup: {}, Heal: {} };
            }

            // Verifica se a magia foi usada com um alvo (como "exura sio" ou "exura gran sio")
            for (const role in cooldowns) {
                for (const tipo in cooldowns[role]) {
                    for (const spell in cooldowns[role][tipo]) {
                        // Verifica a correspondência exata da magia (não apenas prefixos)
                        if (magia.trim() === spell || magia.trim().startsWith(spell + ' "')) {
                            // Verificando se a magia tem um alvo
                            if (magia.includes('"')) {
                                const alvo = magia.split('"')[1]; // Pega o nome do alvo
                                if (!magiasUsadas[jogador][tipo][spell]) {
                                    magiasUsadas[jogador][tipo][spell] = {};
                                }
                                magiasUsadas[jogador][tipo][spell][alvo] = (magiasUsadas[jogador][tipo][spell][alvo] || 0) + 1;
                            } else {
                                magiasUsadas[jogador][tipo][spell] = (magiasUsadas[jogador][tipo][spell] || 0) + 1;
                            }
                        }
                    }
                }
            }
        }
    });

    const tempoCombateTotal = calcularTempoCombate(tempoInicio, tempoFim);

    for (const jogador in magiasUsadas) {
        const jogadorDiv = document.createElement('li');
        jogadorDiv.innerHTML = `<strong>${jogador}</strong> (Tempo de combate: ${tempoCombateTotal} segundos)`;
        resultado.appendChild(jogadorDiv);

        for (const grupo in magiasUsadas[jogador]) {
            const grupoDiv = document.createElement('ul');
            grupoDiv.innerHTML = `<strong>${grupo}</strong>`;
            jogadorDiv.appendChild(grupoDiv);

            let totalUsado = 0;
            let cooldownGrupo = 2; // Cooldown padrão para Atk e Sup

            if (grupo === 'Heal') {
                cooldownGrupo = 1; // Cooldown para Heal
            }

            const idealGrupo = Math.floor(tempoCombateTotal / cooldownGrupo);

            for (const magia in magiasUsadas[jogador][grupo]) {
                const magiaDiv = document.createElement('li');
                const targets = magiasUsadas[jogador][grupo][magia];
                const tempoCooldown = cooldowns.Knight[grupo][magia] || cooldowns.Sorcerer[grupo][magia] || cooldowns.Druid[grupo][magia] || cooldowns.Paladin[grupo][magia];
                const maxUso = Math.floor(tempoCombateTotal / tempoCooldown);

                if (typeof targets === 'object') {
                    // Se a magia tiver alvos diferentes, exibe cada um
                    for (const alvo in targets) {
                        const aproveitamento = ((targets[alvo] / maxUso) * 100).toFixed(2);
                        magiaDiv.innerHTML += `<br>${magia} (Alvo: ${alvo}): ${targets[alvo]} usados | Ideal: ${maxUso} | Aproveitamento: ${aproveitamento}%`;
                        totalUsado += targets[alvo];
                    }
                } else {
                    // Se for uma magia sem alvos, exibe normalmente
                    const aproveitamento = ((targets / maxUso) * 100).toFixed(2);
                    magiaDiv.textContent = `${magia}: ${targets} usados | Ideal: ${maxUso} | Aproveitamento: ${aproveitamento}%`;
                    totalUsado += targets;
                }

                grupoDiv.appendChild(magiaDiv);
            }

            // Adiciona o resumo do grupo
            const resumoGrupoDiv = document.createElement('li');
            const aproveitamentoGrupo = ((totalUsado / idealGrupo) * 100).toFixed(2);
            const turnosPerdidos = idealGrupo - totalUsado;
            resumoGrupoDiv.textContent = `Total do grupo: ${totalUsado} usados | Ideal: ${idealGrupo} | Aproveitamento: ${aproveitamentoGrupo}% | Turnos perdidos: ${turnosPerdidos}`;
            grupoDiv.appendChild(resumoGrupoDiv);
        }
    }
    document.getElementById('copiarResultadoBtn').style.display = 'block'; // Exibe o botão de copiar
}

function calcularTempoCombate(inicio, fim) {
    const [horaInicio, minutoInicio, segundoInicio] = inicio.split(':').map(Number);
    const [horaFim, minutoFim, segundoFim] = fim.split(':').map(Number);
    return (horaFim * 3600 + minutoFim * 60 + segundoFim) - (horaInicio * 3600 + minutoInicio * 60 + segundoInicio);
}

function copiarResultadoGeral() {
    const resultado = document.getElementById('respostas');
    let textoResultado = '';
    resultado.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            textoResultado += node.textContent + '\n';
        }
    });
    navigator.clipboard.writeText(textoResultado).then(() => {
        alert('Resultado geral copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar resultado geral: ', err);
    });
}
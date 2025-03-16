function contarMagias() {
    const logInput = document.getElementById("logInput").value;
    const lines = logInput.split('\n');
    const magiasPorJogador = {};

  
    lines.forEach(line => {

        const regex = /\d{2}:\d{2}:\d{2} (.+?) \[\d+\]: (.+)/;
        const match = line.match(regex);
        
        if (match) {
            const jogador = match[1].trim();  
            const magia = match[2];
      
            if (!magiasPorJogador[jogador]) {
                magiasPorJogador[jogador] = {};
            }

            if (!magiasPorJogador[jogador][magia]) {
                magiasPorJogador[jogador][magia] = 0;
            }


            magiasPorJogador[jogador][magia]++;
        }
    });
 
    const respostas = document.getElementById("respostas");
    respostas.innerHTML = ''; 

    for (const jogador in magiasPorJogador) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${jogador}:</strong><ul>`;
        
        for (const magia in magiasPorJogador[jogador]) {
            li.innerHTML += `<li>${magia}: ${magiasPorJogador[jogador][magia]}</li>`;
        }

        li.innerHTML += '</ul>';
        respostas.appendChild(li);
    }
}

let fila = [];
let quadra = { vermelho: [], azul: [] };
let timeDescanso = [];
let proximoTime = [];
let config = { jogadoresPorTime: 3, descansoAutomatico: false, vitoriasParaDescanso: 3 };
let partidas = { vermelho: 0, azul: 0 };

function salvarEstado() {
    localStorage.setItem("fila", JSON.stringify(fila));
    localStorage.setItem("quadra", JSON.stringify(quadra));
    localStorage.setItem("descanso", JSON.stringify(timeDescanso));
    localStorage.setItem("proximo", JSON.stringify(proximoTime));
    localStorage.setItem("config", JSON.stringify(config));
    localStorage.setItem("partidas", JSON.stringify(partidas));
}

function carregarEstado() {
    fila = JSON.parse(localStorage.getItem("fila")) || [];
    quadra = JSON.parse(localStorage.getItem("quadra")) || { vermelho: [], azul: [] };
    timeDescanso = JSON.parse(localStorage.getItem("descanso")) || [];
    proximoTime = JSON.parse(localStorage.getItem("proximo")) || [];
    config = JSON.parse(localStorage.getItem("config")) || { jogadoresPorTime: 3, descansoAutomatico: false, vitoriasParaDescanso: 3 };
    partidas = JSON.parse(localStorage.getItem("partidas")) || { vermelho: 0, azul: 0 };

    document.getElementById("inputJogadoresPorTime").value = config.jogadoresPorTime;
    document.getElementById("descansoAutomatico").checked = config.descansoAutomatico;
    document.getElementById("inputVitoriasParaDescanso").value = config.vitoriasParaDescanso;
}

function atualizarConfigJogadores() {
    const valor = parseInt(document.getElementById("inputJogadoresPorTime").value);
    if (valor >= 1 && valor <= 10) {
        config.jogadoresPorTime = valor;
        ajustarTimesParaConfig();
        salvarEstado();
        atualizarInterface();
    }
}

function atualizarConfigVitoriasDescanso() {
    const valor = parseInt(document.getElementById("inputVitoriasParaDescanso").value);
    if (valor >= 1 && valor <= 10) {
        config.vitoriasParaDescanso = valor;
        salvarEstado();
    }
}

function atualizarConfigDescansoAutomatico() {
    config.descansoAutomatico = document.getElementById("descansoAutomatico").checked;
    salvarEstado();
}

function ajustarTimesParaConfig() {
    while (quadra.vermelho.length > config.jogadoresPorTime) {
        fila.push(quadra.vermelho.pop());
    }
    while (quadra.azul.length > config.jogadoresPorTime) {
        fila.push(quadra.azul.pop());
    }
    while (proximoTime.length > config.jogadoresPorTime) {
        fila.push(proximoTime.pop());
    }
}

function adicionarJogador() {
    const nome = document.getElementById("nomeJogador").value.trim();
    if (!nome) return alert("Digite o nome do jogador.");
    if (estaNaFilaOuTimes(nome)) return alert("Jogador já está na fila, time, descanso ou próximo time.");
    fila.push(nome);
    document.getElementById("nomeJogador").value = "";
    salvarEstado();
    atualizarInterface();
}

// Permite adicionar jogador ao pressionar Enter no campo
document.getElementById("nomeJogador").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        adicionarJogador();
    }
});

function estaNaFilaOuTimes(nome) {
    return fila.includes(nome) || quadra.vermelho.includes(nome) || quadra.azul.includes(nome)
        || timeDescanso.includes(nome) || proximoTime.includes(nome);
}

function estaNaQuadra(nome) {
    return quadra.vermelho.includes(nome) || quadra.azul.includes(nome);
}

function moverParaTime(nome, time) {
    if (estaNaQuadra(nome)) return alert("Jogador já está em quadra.");
    if (quadra[time].length >= config.jogadoresPorTime) return alert(`O time ${time} já está cheio.`);
    if (confirm(`Mover "${nome}" para o time ${time}?`)) {
        quadra[time].push(nome);
        fila = fila.filter(p => p !== nome);
        salvarEstado();
        atualizarInterface();
    }
}

function adicionarAoProximoTime(nome) {
    if (proximoTime.length >= config.jogadoresPorTime) return alert("Próximo time já está cheio.");
    if (estaNaFilaOuTimes(nome)) return alert("Jogador já está em algum lugar.");
    if (confirm(`Adicionar "${nome}" ao próximo time?`)) {
        proximoTime.push(nome);
        fila = fila.filter(p => p !== nome);
        salvarEstado();
        atualizarInterface();
    }
}

function removerDaFila(nome) {
    if (confirm(`Remover "${nome}" da fila?`)) {
        fila = fila.filter(p => p !== nome);
        salvarEstado();
        atualizarInterface();
    }
}

function atualizarInterface() {
    const renderLista = (elementId, lista) => {
        const ul = document.getElementById(elementId);
        ul.innerHTML = "";
        lista.forEach(nome => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center jogador";

            li.textContent = nome;

            if (elementId === "listaFila") {
                // Botões de mover para time e remover da fila
                const btnGroup = document.createElement("div");
                btnGroup.className = "btn-group btn-group-sm";

                const btnVermelho = document.createElement("button");
                btnVermelho.className = "btn btn-outline-danger fa fa-circle icon-circulo-vermelho";
                btnVermelho.textContent = "";
                btnVermelho.title = "Mover para Time Vermelho";
                btnVermelho.onclick = () => moverParaTime(nome, "vermelho");

                const btnAzul = document.createElement("button");
                btnAzul.className = "btn btn-outline-primary fa fa-circle icon-circulo-azul";
                btnAzul.textContent = "";
                btnAzul.title = "Mover para Time Azul";
                btnAzul.onclick = () => moverParaTime(nome, "azul");

                const btnProximo = document.createElement("button");
                btnProximo.className = "btn btn-outline-warning fa fa-fast-forward";
                btnProximo.textContent = "";
                btnProximo.title = "Adicionar ao Próximo Time";
                btnProximo.onclick = () => {
                    if (confirm(`Adicionar "${nome}" ao próximo time?`)) {
                        if (proximoTime.length < config.jogadoresPorTime) {
                            proximoTime.push(nome);
                            fila = fila.filter(p => p !== nome);
                            salvarEstado();
                            atualizarInterface();
                        } else {
                            alert("Próximo time está cheio!");
                        }
                    }
                };

                const btnRemover = document.createElement("button");
                btnRemover.className = "btn btn-outline-danger fa fa-times";
                btnRemover.textContent = "";
                btnRemover.title = "Remover da fila";
                btnRemover.onclick = () => removerDaFila(nome);

                btnGroup.appendChild(btnVermelho);
                btnGroup.appendChild(btnAzul);
                btnGroup.appendChild(btnProximo);
                btnGroup.appendChild(btnRemover);

                li.appendChild(btnGroup);
            }

            if (elementId === "timeVermelho" || elementId === "timeAzul") {
                const cor = elementId === "timeVermelho" ? "vermelho" : "azul";
                const btnVoltarFila = document.createElement("button");
                btnVoltarFila.className = "btn btn-sm btn-outline-secondary fa fa-undo ms-2";
                btnVoltarFila.textContent = "";
                btnVoltarFila.title = "Voltar para fila";
                btnVoltarFila.onclick = () => {
                    if (confirm(`Retirar "${nome}" do time ${cor} para fila?`)) {
                        quadra[cor] = quadra[cor].filter(p => p !== nome);
                        fila.push(nome);
                        salvarEstado();
                        atualizarInterface();
                    }
                };
                li.appendChild(btnVoltarFila);
            }

            if (elementId === "timeDescanso") {
                // Apenas texto, sem botões
            }

            // Aqui adicionamos o botão de mover para a quadra, que será mostrado na lista de "próximo time"
            if (elementId === "listaProximoTime") {
                const btnMoverParaQuadra = document.createElement("button");
                btnMoverParaQuadra.className = "btn btn-sm btn-outline-secondary fa fa-arrow-up ms-2";
                btnMoverParaQuadra.textContent = "";
                btnMoverParaQuadra.title = "Mover para a Quadra";
                btnMoverParaQuadra.onclick = () => {
                    if (!confirm(`Mover "${nome}" do próximo time para a quadra?`)) return;
                    // Tenta mover para o primeiro time incompleto
                    if (quadra.vermelho.length < config.jogadoresPorTime) {
                        // Se o time vermelho tem espaço, move o jogador para ele
                        quadra.vermelho.push(nome);
                    } else if (quadra.azul.length < config.jogadoresPorTime) {
                        // Se o time azul tem espaço, move o jogador para ele
                        quadra.azul.push(nome);
                    } else {
                        // Caso ambos os times estejam cheios
                        alert("Ambos os times estão completos! Não há espaço para mover o jogador.");
                        return;
                    }

                    // Remove o jogador da lista de próximo time
                    proximoTime = proximoTime.filter(p => p !== nome);
                    salvarEstado();  // Salva o estado
                    atualizarInterface();  // Atualiza a interface
                };

                li.appendChild(btnMoverParaQuadra);
            }

            ul.appendChild(li);
        });
    };

    renderLista("listaFila", fila);
    renderLista("listaProximoTime", proximoTime);
    renderLista("timeVermelho", quadra.vermelho);
    renderLista("timeAzul", quadra.azul);
    renderLista("timeDescanso", timeDescanso);

    document.getElementById("contadorVermelho").textContent = partidas.vermelho;
    document.getElementById("contadorAzul").textContent = partidas.azul;
}

function moverProximoParaQuadra() {
    // Verifica se há próximo time completo
    if (proximoTime.length === 0) {
        alert("Não há jogadores no próximo time.");
        return;
    }

    if (!confirm("Mover todo o próximo time para a quadra?")) return;

    // Verifica se algum time na quadra está vazio
    if (quadra.vermelho.length === 0) {
        quadra.vermelho = [...proximoTime];
        proximoTime = [];
    } else if (quadra.azul.length === 0) {
        quadra.azul = [...proximoTime];
        proximoTime = [];
    } else {
        alert("Os dois times estão completos. Remova um time antes de adicionar o próximo.");
        return;
    }

    salvarEstado();
    atualizarInterface();
}

function registrarDerrota(timePerdedor) {
    const timeVencedor = timePerdedor === "vermelho" ? "azul" : "vermelho";

    // Verifica se há jogadores no time perdedor
    if (quadra[timePerdedor].length === 0) {
        alert(`O time ${timePerdedor === "vermelho" ? "Vermelho" : "Azul"} não tem jogadores. A ação foi cancelada.`);
        return;
    }

    // Voltar jogadores do time perdedor para a fila
    fila = [...fila, ...quadra[timePerdedor]];
    quadra[timePerdedor] = [];

    partidas[timePerdedor] = 0;

    // Só soma vitória se o time vencedor tiver jogadores
    if (quadra[timeVencedor].length > 0) {
        partidas[timeVencedor]++;
    }

    if (config.descansoAutomatico && partidas[timeVencedor] >= config.vitoriasParaDescanso && quadra[timeVencedor].length > 0) {
        alert(`O time ${timeVencedor === "vermelho" ? "Vermelho" : "Azul"} venceu ${config.vitoriasParaDescanso} partidas e vai para o descanso!`);

        timeDescanso = [...quadra[timeVencedor]];
        quadra[timeVencedor] = [];
        partidas[timeVencedor] = 0;

        if (proximoTime.length === config.jogadoresPorTime) {
            quadra[timePerdedor] = [...proximoTime];
            proximoTime = [];
        } else {
            quadra.vermelho = [];
            quadra.azul = [];
            alert("Não há próximo time disponível. Ambos os times devem ser montados manualmente.");
        }
    } else {
        if (timeDescanso.length > 0) {
            quadra[timePerdedor] = [...timeDescanso];
            timeDescanso = [];
        } else if (proximoTime.length === config.jogadoresPorTime) {
            quadra[timePerdedor] = [...proximoTime];
            proximoTime = [];
        } else {
            quadra[timePerdedor] = [];
            alert(`O time ${timePerdedor} perdeu, jogadores voltaram para fila.`);
        }
    }

    salvarEstado();
    atualizarInterface();
}

function confirmarDerrota(time) {
    if (confirm(`Confirmar que o time ${time === "vermelho" ? "Vermelho" : "Azul"} perdeu?`)) {
        registrarDerrota(time);
    }
}

function resetar() {
    if (confirm("Resetar tudo? Todos os dados serão apagados.")) {
        fila = [];
        quadra = { vermelho: [], azul: [] };
        timeDescanso = [];
        proximoTime = [];
        partidas = { vermelho: 0, azul: 0 };
        salvarEstado();
        atualizarInterface();
    }
}

// Inicialização
carregarEstado();
ajustarTimesParaConfig();
atualizarInterface();
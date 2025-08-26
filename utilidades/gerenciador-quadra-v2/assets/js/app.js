import config from './config.js';
import Time from './time.js';
import Fila from './fila.js';
import Quadra from './quadra.js';
import Grupo from './grupo.js';
import notificacao from './notificacao.js';
import Jogador from './jogador.js';
import Database from './Database.js'


const quadra = new Quadra();
const db = new Database(); // Instancia a nova classe

const cbDescanso = document.getElementById('ativar-descanso');
const cbRetornoDescanso = document.getElementById('retorno-automatico-descanso');
const cbMoverProximo = document.getElementById('mover-proximo-automatico');
const cbPrimeiroFila = document.getElementById('primeiro-fila-proximo');
const elementVitoriaVerde = document.getElementById('vitoria-verde');
const elementVitoriaAzul = document.getElementById('vitoria-azul');

const elementDescansoVerde = document.getElementById('descanso-verde');
const elementDescansoAzul = document.getElementById('descanso-azul');


function gerarBotao(classe, onClick) {
    const btn = document.createElement('button');
    btn.className = classe;
    btn.onclick = onClick;
    return btn;
}

function mostrarNotificacao(tipo, mensagem) {
    if (document.getElementById('ativar-notificacoes').checked) {
        const notificacoesContainer = document.getElementById("notificacoes");
        const notificacao = document.createElement("div");
        notificacao.classList.add("notificacao", "alert", tipo);
        notificacao.textContent = mensagem;

        notificacoesContainer.appendChild(notificacao);

        setTimeout(() => {
            notificacao.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            notificacao.style.opacity = 0;
            setTimeout(() => {
                notificacoesContainer.removeChild(notificacao);
            }, 500);
        }, 5000);
    }
}


function gerarBotoesFila(jogador) {
    return [
        gerarBotao('ms-auto btn btn-outline-success btn-sm bi bi-circle-fill', () => {
            if (confirm(`Mover o jogador ${jogador.getNome()} para o Time Verde?`)) moverJogador(jogador, quadra.getTimeVerde());
        }),
        gerarBotao('ms-1 btn btn-outline-primary btn-sm bi bi-circle-fill', () => {
            if (confirm(`Mover o jogador ${jogador.getNome()} para o Time Azul?`)) moverJogador(jogador, quadra.getTimeAzul());
        }),
        gerarBotao('ms-1 btn btn-outline-warning btn-sm bi bi-arrow-right', () => {
            if (confirm(`Mover o jogador ${jogador.getNome()} para o Próximo Time?`)) moverJogador(jogador, quadra.getTimeProximo());
        }),
        gerarBotao('ms-1 btn btn-outline-danger btn-sm bi bi-trash', () => {
            if (confirm(`Remover o jogador ${jogador.getNome()} da fila?`)) moveOuRemoveJogador(jogador);
        })
    ];
}

function gerarBotoesTime(jogador) {
    return [
        gerarBotao('ms-auto btn btn-outline-secondary btn-sm bi bi-arrow-counterclockwise', () => {
            if (confirm(`Tem certeza que deseja remover o jogador ${jogador.getNome()} deste grupo?`)) {
                moveOuRemoveJogador(jogador);
            }
        })
    ];
}

function gerarBotoesProximoTime(jogador) {
    return [
        gerarBotao('ms-auto btn btn-outline-secondary btn-sm bi bi-arrow-counterclockwise', () => {
            if (confirm(`Tem certeza que deseja remover o jogador ${jogador.getNome()} do Próximo Time?`)) {
                moveOuRemoveJogador(jogador);
            }
        }),
        gerarBotao('ms-1 btn btn-outline-success btn-sm bi bi-circle-fill', () => {
            if (confirm(`Mover ${jogador.getNome()} para o Time Verde?`)) moverJogador(jogador, quadra.getTimeVerde());
        }),
        gerarBotao('ms-1 btn btn-outline-primary btn-sm bi bi-circle-fill', () => {
            if (confirm(`Mover ${jogador.getNome()} para o Time Azul?`)) moverJogador(jogador, quadra.getTimeAzul());
        })
    ];
}

function gerarLista(grupo, idLista, gerarBotoes) {
    const lista = document.getElementById(idLista);
    lista.innerHTML = '';

    grupo.getJogadores().forEach(jogador => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="fs-6 fs-md-4 fs-lg-2">${jogador.getNome()} </span>`;
        li.className = 'list-group-item d-flex align-items-center px-0 py-1';

        const botoes = gerarBotoes(jogador);
        botoes.forEach(btn => li.appendChild(btn));

        lista.appendChild(li);
    });

    return lista;
}

function atualizarListaTimes() {
    gerarLista(quadra.getTimeVerde(), 'lista-time-verde', gerarBotoesTime);
    gerarLista(quadra.getTimeAzul(), 'lista-time-azul', gerarBotoesTime);
    gerarLista(quadra.getTimeProximo(), 'lista-proximos', gerarBotoesProximoTime);
    gerarLista(quadra.getTimeDescanso(), 'lista-descanso', gerarBotoesTime);
    gerarLista(quadra.getFilaEspera(), 'lista-fila-espera', gerarBotoesFila);
}


function verificarVagaNoTime(time) {
    return quadra.getLimiteJogadoresTime() - time.getTotalJogadores();
}

function moverJogador(jogador, destino) {
    if (verificarVagaNoTime(destino) <= 0) {
        mostrarNotificacao(notificacao.class.falha, `${destino.getNome()} atingiu o limite de jogadores.`);
        return;
    }

    jogador.getGrupo().moverJogador(jogador, destino);
    mostrarNotificacao(notificacao.class.sucesso, `${jogador.getNome()} movido(a) para ${destino.getNome()}.`);
    moverPrimeiroDaFilaParaProximo();
    atualizarListaTimes();
    salvarDados();
}

function moveOuRemoveJogador(jogador) {
    const grupo = jogador.getGrupo();

    if (grupo instanceof Time) {
        grupo.moverJogador(jogador, quadra.getFilaEspera());
        mostrarNotificacao(notificacao.class.sucesso, `${jogador.getNome()} retornou ao final da fila.`);
        if (cbPrimeiroFila.checked) {
            moverPrimeiroDaFilaParaProximo();
        }
    } else if (grupo instanceof Fila) {
        mostrarNotificacao(notificacao.class.sucesso, `${jogador.getNome()} foi removido(a) da fila.`);
        grupo.removeJogador(jogador);
    }

    atualizarListaTimes();
    salvarDados();
}


function atualizarConfigJogadores() {
    const inputLimiteJogadores = document.getElementById('inputJogadoresPorTime');
    if (inputLimiteJogadores) {
        quadra.setLimiteJogadoresTime(parseInt(inputLimiteJogadores.value, 10));
    }
    salvarDados();
}

function toggleDescanso() {
    const sessaoDescanso = document.getElementById('sessao-descanso');
    const configDescanso = document.getElementById('config-descanso');
    const placarVerdeDescanso = document.getElementById('id-descanso-verde');
    const placarAzulDescanso = document.getElementById('id-descanso-azul');

    if (!cbDescanso.checked && quadra.getTimeDescanso().getTotalJogadores() > 0) {
        cbDescanso.checked = true;
        mostrarNotificacao(notificacao.class.aviso, notificacao.mensagem.aviso.existeJogadoresDescanso);
        return;
    }

    config.descanso = cbDescanso.checked; // Atualiza a configuração
    if (cbDescanso.checked) {
        sessaoDescanso.classList.remove('d-none');
        configDescanso.classList.remove('d-none');
        placarAzulDescanso.classList.remove('d-none');
        placarVerdeDescanso.classList.remove('d-none');
        moverQuadraDescanso();
    } else {
        sessaoDescanso.classList.add('d-none');
        configDescanso.classList.add('d-none');
        placarAzulDescanso.classList.add('d-none');
        placarVerdeDescanso.classList.add('d-none');
    }
    salvarDados();
}

function vitoriasParaDescanso() {
    const inputVitoriasParaDescanso = document.getElementById('qtdJogosDescanso');
    if (inputVitoriasParaDescanso) {
        config.limiteVitorias = parseInt(inputVitoriasParaDescanso.value, 10);
    }
    atualizarPlacaresGlobal();
    salvarDados();
}

function atualizarPlacaresGlobal() {
    criarRanking()
    criarRankingTimes()
    elementDescansoAzul.innerHTML = `${quadra.getVitoriasAzul()}/${config.limiteVitorias}`;
    elementDescansoVerde.innerHTML = `${quadra.getVitoriasVerde()}/${config.limiteVitorias}`;
    elementVitoriaAzul.innerHTML = quadra.getTimeAzul().getVitorias();
    elementVitoriaVerde.innerHTML = quadra.getTimeVerde().getVitorias();
}


function moverQuadraDescanso() {
    moverAzulParaDescanso();
    moverVerdeParaDescanso();
    atualizarListaTimes();
    atualizarPlacaresGlobal();
    salvarDados();
}

function retornoAutomaticoDescanso() {
    config.retornoAutomatico = cbRetornoDescanso.checked;
    if (cbRetornoDescanso.checked && (quadra.getVitoriasVerde() >= 1 || quadra.getVitoriasAzul() >= 1)) {
        moverDescansoTime();
    }
    salvarDados();
}

function moverProximoQuadraAutomatico() {
    config.proximoAutomatico = cbMoverProximo.checked;
    if (cbMoverProximo.checked) {
        if (quadra.getTimeDescanso().getTotalJogadores() >= 1) {
            return;
        }
        moverProximoTime();
    }
    salvarDados();
}

function moverPrimeiroDaFilaParaProximo() {
    config.filaAutomatica = cbPrimeiroFila.checked;
    if (cbPrimeiroFila.checked) {
        if (quadra.getTimeProximo().getTotalJogadores() <= 0) {
            let primeiroFila = quadra.getFirstJogadorFila();
            if(primeiroFila) {
                quadra.getTimeProximo().addJogador(primeiroFila);
                atualizarListaTimes();
            }
        }
    }
    salvarDados();
}


function adicionarJogador() {
    const nomeInput = document.getElementById('nome-jogador');
    const nome = nomeInput ? nomeInput.value.trim() : '';

    if (!nome) return;

    if (quadra.setJogadorFila(new Jogador(nome))) {
        mostrarNotificacao(notificacao.class.sucesso, notificacao.mensagem.sucesso.jogadorAdicionado);
    } else {
        mostrarNotificacao(notificacao.class.falha, notificacao.mensagem.falha.erroAdicionarJogador);
    }

    atualizarListaTimes();
    limparInputNome();
    salvarDados();
}

function limparInputNome() {
    const nomeInput = document.getElementById('nome-jogador');
    if (nomeInput) nomeInput.value = '';
}


function btnVitoria(timeCor) {
    if (!validarTimesCompletos()) return;
    if (timeCor === 'verde') {
        if (!confirm(`Deseja confirmar uma vitória para o ${quadra.getTimeVerde().getNome()}?`)) return;
        registrarVitoriaTimeVerde();
    } else if (timeCor === 'azul') {
        if (!confirm(`Deseja confirmar uma vitória para o ${quadra.getTimeAzul().getNome()}?`)) return;
        registrarVitoriaTimeAzul();
    }

    if (cbRetornoDescanso.checked
        && quadra.getTimeDescanso().getTotalJogadores() > 0
        && (quadra.getVitoriasVerde() >= 1
        || quadra.getVitoriasAzul() >= 1)) {
            moverDescansoTime();
    }

    if (cbMoverProximo.checked
        && quadra.getTimeProximo().getTotalJogadores() > 0
        && quadra.getTimeDescanso().getTotalJogadores() === 0
        && (quadra.getTimeAzul().getTotalJogadores() === 0
        || quadra.getTimeVerde().getTotalJogadores() === 0)) {
            moverProximoTime();
    }

    if (cbPrimeiroFila.checked) {
        moverPrimeiroDaFilaParaProximo();
    }

    atualizarPlacaresGlobal();
    atualizarListaTimes();
    salvarDados();
}


function validarTimesCompletos() {
    if (quadra.getLimiteJogadoresTime() !== quadra.getTimeVerde().getTotalJogadores() || quadra.getLimiteJogadoresTime() !== quadra.getTimeAzul().getTotalJogadores()) {
        mostrarNotificacao(notificacao.class.falha, notificacao.mensagem.falha.timesIncompletos);
        return false;
    }
    return true;
}

function registrarVitoriaTimeVerde() {
    quadra.getTimeVerde().addVitoria();
    quadra.addVitoriaVerde();

    quadra.getTimeVerde().getJogadores().forEach(jogador => {
        jogador.addVitoria();
        db.salvarJogador(jogador);
    });

    const timeAzul = quadra.removeTimeAzul();
    timeAzul.getJogadores().forEach(jogador => {
        jogador.addDerrota();
        quadra.getFilaEspera().addJogador(jogador);
        db.salvarJogador(jogador);
    });

    db.registrarVitoriaTime({
        nomeTime: quadra.getTimeVerde().getNome(),
        jogadores: quadra.getTimeVerde().getJogadores().map(j => j.getNome())
    });

    moverVerdeParaDescanso();
    mostrarNotificacao(notificacao.class.sucesso, notificacao.mensagem.sucesso.vitoriaVerdeRegistrada);
}

function registrarVitoriaTimeAzul() {
    quadra.getTimeAzul().addVitoria();
    quadra.addVitoriaAzul();

    quadra.getTimeAzul().getJogadores().forEach(jogador => {
        jogador.addVitoria();
        db.salvarJogador(jogador);
    });

    const timeVerde = quadra.removeTimeVerde();
    timeVerde.getJogadores().forEach(jogador => {
        jogador.addDerrota();
        db.salvarJogador(jogador);
        quadra.getFilaEspera().addJogador(jogador);
    });

    db.registrarVitoriaTime({
        nomeTime: quadra.getTimeAzul().getNome(),
        jogadores: quadra.getTimeAzul().getJogadores().map(j => j.getNome())
    });

    moverAzulParaDescanso();
    mostrarNotificacao(notificacao.class.sucesso, notificacao.mensagem.sucesso.vitoriaAzulRegistrada);
}


function moverVerdeParaDescanso() {
    if (cbDescanso.checked && quadra.getVitoriasVerde() >= config.limiteVitorias && quadra.getTimeDescanso().getTotalJogadores() === 0) {
        let time = quadra.removeTimeVerde();
        quadra.setTimeDescanso(time);
        quadra.resetVitoriasVerde();
    }
}

function moverAzulParaDescanso() {
    if (cbDescanso.checked && quadra.getVitoriasAzul() >= config.limiteVitorias && quadra.getTimeDescanso().getTotalJogadores() === 0) {
        let time = quadra.removeTimeAzul();
        quadra.setTimeDescanso(time);
        quadra.resetVitoriasAzul();
    }
}


function btnMoverProximoTime(idBtn) {
    if (idBtn === 'btnProximoTime') {
        if (!confirm(`Deseja mover o ${quadra.getTimeProximo().getNome()} para a quadra?`)) return;
        if (!moverProximoTime()) {
            mostrarNotificacao(notificacao.class.falha, notificacao.mensagem.falha.erroMoverTimeProximo);
        } else {
            mostrarNotificacao(notificacao.class.sucesso, notificacao.mensagem.sucesso.timeProximoMovidoParaQuadra);
        }
    } else if (idBtn === 'btnDescansoTime') {
        if (!confirm(`Deseja mover o ${quadra.getTimeDescanso().getNome()} para a quadra?`)) return;
        if (!moverDescansoTime()) {
            mostrarNotificacao(notificacao.class.falha, notificacao.mensagem.falha.erroMoverTimeDescanso);
        } else {
            mostrarNotificacao(notificacao.class.sucesso, notificacao.mensagem.sucesso.timeDescansoMovidoParaQuadra);
        }
    }
    salvarDados();
}

function moverProximoTime() {
    if (quadra.addProximoParaJogo()) {
        if (cbPrimeiroFila.checked) {
            moverPrimeiroDaFilaParaProximo();
        }
        atualizarListaTimes();
        atualizarPlacaresGlobal();
        salvarDados();
        return true;
    }
    return false;
}

function moverDescansoTime() {
    if (quadra.addDescansoParaJogo()) {
        atualizarListaTimes();
        atualizarPlacaresGlobal();
        salvarDados();
        return true;
    }
    return false;
}


// RANKINGS
async function criarRanking() {
    const jogadoresUnicos = await db.carregarTodosJogadores();

    // Ordena os jogadores por número de vitórias (do maior para o menor)
    jogadoresUnicos.sort((a, b) => {
        // Classificação principal: número de vitórias
        if (b.vitorias !== a.vitorias) {
            return b.vitorias - a.vitorias;
        }
        // Critério de desempate: quem tem menos derrotas fica na frente
        return a.derrotas - b.derrotas;
    });

    // Cria a lista de ranking na UI
    const rankingList = document.getElementById('lista-ranking');
    rankingList.innerHTML = '';

    jogadoresUnicos.forEach((jogador, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${index + 1}. <strong>${jogador.nome}</strong><br>
            <small>Vitórias: ${jogador.vitorias} | Derrotas: ${jogador.derrotas}
        </small>`;
        rankingList.appendChild(li);
    });
}

async function criarRankingTimes() {
    const historico = await db.carregarHistoricoVitorias();
    const ranking = {};

    historico.forEach(vitoria => {
        // Cria um identificador único para a equipe, ordenando os nomes dos jogadores
        const jogadoresOrdenados = vitoria.jogadores.sort().join(', ');

        if (!ranking[jogadoresOrdenados]) {
            ranking[jogadoresOrdenados] = {
                vitorias: 0,
                jogadores: vitoria.jogadores // Salva a lista original de jogadores
            };
        }
        ranking[jogadoresOrdenados].vitorias++;
    });

    // Converte o objeto para um array para poder ordenar
    const rankingArray = Object.keys(ranking).map(key => ({
        jogadores: ranking[key].jogadores,
        vitorias: ranking[key].vitorias
    }));

    // Ordena os times por número de vitórias
    rankingArray.sort((a, b) => b.vitorias - a.vitorias);

    // Exibe o ranking na tela
    const rankingList = document.getElementById('lista-ranking-times');
    rankingList.innerHTML = '';

    rankingArray.forEach((time, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        const jogadoresHTML = time.jogadores.join(', ');

        li.innerHTML = `
            ${index + 1}. Vitórias: ${time.vitorias}<br>
            <small>Jogadores: ${jogadoresHTML}</small>
        `;
        rankingList.appendChild(li);
    });
}


// Funções de salvamento e carregamento
async function salvarDados() {
    const dados = quadra.serializar();
    dados.config = {
        limiteJogadoresPorTime: parseInt(document.getElementById('inputJogadoresPorTime').value, 10),
        ativarDescanso: document.getElementById('ativar-descanso').checked,
        qtdJogosDescanso: parseInt(document.getElementById('qtdJogosDescanso').value, 10),
        retornoAutomaticoDescanso: document.getElementById('retorno-automatico-descanso').checked,
        moverProximoAutomatico: document.getElementById('mover-proximo-automatico').checked,
        primeiroFilaProximo: document.getElementById('primeiro-fila-proximo').checked,
        ativarNotificacoes: document.getElementById('ativar-notificacoes').checked
    };
    await db.salvarDados(dados);
}

async function carregarDados() {
    const dadosCarregados = await db.carregarDados();
    if (dadosCarregados) {
        quadra.desserializar(dadosCarregados);
        const configUI = dadosCarregados.config;

        const jogadoresSalvos = await db.carregarTodosJogadores();
        jogadoresSalvos.forEach(j => {
            // Isso é opcional, mas garante que os objetos Jogador tenham os dados corretos
            // Se você não for usar os dados em tempo real, pode pular
        });

        if (configUI) {
            document.getElementById('inputJogadoresPorTime').value = configUI.limiteJogadoresPorTime;
            document.getElementById('ativar-descanso').checked = configUI.ativarDescanso;
            document.getElementById('qtdJogosDescanso').value = configUI.qtdJogosDescanso;
            document.getElementById('retorno-automatico-descanso').checked = configUI.retornoAutomaticoDescanso;
            document.getElementById('mover-proximo-automatico').checked = configUI.moverProximoAutomatico;
            document.getElementById('primeiro-fila-proximo').checked = configUI.primeiroFilaProximo;
            document.getElementById('ativar-notificacoes').checked = configUI.ativarNotificacoes;
        }

        atualizarConfigJogadores();
        toggleDescanso();
        vitoriasParaDescanso();
        atualizarPlacaresGlobal();
        atualizarListaTimes();
    } else {
        atualizarConfigJogadores();
        atualizarListaTimes();
        toggleDescanso();
        vitoriasParaDescanso();
    }
}

async function resetarAplicativo() {
    if (confirm("Tem certeza que deseja resetar todos os dados? Esta ação é irreversível.")) {
        await db.resetarDados();
        window.location.reload();
    }
}

document.getElementById("nome-jogador").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        adicionarJogador();
    }
});

// Chamar a função de carregamento ao carregar a página
window.addEventListener('DOMContentLoaded', carregarDados);

document.getElementById('btnTimeVerde').addEventListener('click', () => { btnVitoria('verde'); });
document.getElementById('btnTimeAzul').addEventListener('click', () => { btnVitoria('azul'); });
document.getElementById('btnProximoTime').addEventListener('click', (event) => { btnMoverProximoTime(event.target.id); });
document.getElementById('btnDescansoTime').addEventListener('click', (event) => { btnMoverProximoTime(event.target.id); });

// document.getElementById('btn-ranking').addEventListener('click', criarRanking);
// document.getElementById('btn-ranking-times').addEventListener('click', criarRankingTimes);
document.getElementById('btn-reset').addEventListener('click', resetarAplicativo);
document.getElementById('adicionar-btn').addEventListener('click', adicionarJogador);
document.getElementById('inputJogadoresPorTime').addEventListener('change', atualizarConfigJogadores);
document.getElementById('ativar-descanso').addEventListener('change', toggleDescanso);
document.getElementById('qtdJogosDescanso').addEventListener('change', vitoriasParaDescanso);
document.getElementById('retorno-automatico-descanso').addEventListener('change', retornoAutomaticoDescanso);
document.getElementById('mover-proximo-automatico').addEventListener('change', moverProximoQuadraAutomatico);
document.getElementById('primeiro-fila-proximo').addEventListener('change', moverPrimeiroDaFilaParaProximo);
document.getElementById('ativar-notificacoes').addEventListener('change', salvarDados);


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/utilidades/gerenciador-quadra-v2/service-worker.js').then((registration) => {
      console.log('Service Worker registrado com sucesso:', registration);
    }).catch((error) => {
      console.log('Erro ao registrar o Service Worker:', error);
    });
  });
}

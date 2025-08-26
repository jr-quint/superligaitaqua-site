import Time from './time.js';
import Fila from './fila.js';
import Jogador from './jogador.js';

class Quadra {
    _timeVerde;
    _timeAzul;
    _timeProximo;
    _timeDescanso;
    _filaEspera;
    _limiteJogadoresTime;

    constructor() {
        this.setTimeVerde(new Time());
        this.setTimeAzul(new Time());
        this.setTimeProximo(new Time());
        this.setTimeDescanso(new Time());
        this._setFilaEspera(new Fila());
        this._limiteJogadoresTime = 4;
    }

    getTimeVerde() {
        return this._timeVerde.time;
    }

    setTimeVerde(time) {
        time.setNome('Time Verde');
        time.setQuadra(this);
        this._timeVerde = {
            vitorias: 0,
            time: time
        };
    }

    getTimeAzul() {
        return this._timeAzul.time;
    }

    setTimeAzul(time) {
        time.setNome('Time Azul');
        time.setQuadra(this);
        this._timeAzul = {
            vitorias: 0,
            time: time
        };
    }

    getTimeProximo() {
        return this._timeProximo;
    }

    setTimeProximo(time) {
        time.setNome("Próximo");
        time.setQuadra(this);
        this._timeProximo = time;
    }

    getTimeDescanso() {
        return this._timeDescanso;
    }

    setTimeDescanso(time) {
        time.setNome('Descanso');
        time.setQuadra(this);
        this._timeDescanso = time;
    }

    getFilaEspera() {
        return this._filaEspera;
    }

    getFirstJogadorFila() {
        return this._filaEspera.getJogadores().shift();
    }

    _setFilaEspera(fila) {
        fila.setNome('Fila');
        fila.setQuadra(this);
        this._filaEspera = fila;
    }

    getLimiteJogadoresTime() {
        return this._limiteJogadoresTime;
    }

    setLimiteJogadoresTime(limite) {
        this._limiteJogadoresTime = limite;
    }

    getVitoriasVerde() {
        return this._timeVerde.vitorias;
    }

    addVitoriaVerde() {
        return ++this._timeVerde.vitorias;
    }

    resetVitoriasVerde() {
        this._timeVerde.vitorias = 0;
    }

    getVitoriasAzul() {
        return this._timeAzul.vitorias;
    }

    addVitoriaAzul() {
        return ++this._timeAzul.vitorias;
    }

    resetVitoriasAzul() {
        this._timeAzul.vitorias = 0;
    }

    setJogadorFila(jogador) {
        if (this._validarAddJogador(jogador)) {
            return this._filaEspera.addJogador(jogador);
        }
        return false;
    }

    addProximoParaJogo() {
        if (this._timeProximo.getTotalJogadores() === this._limiteJogadoresTime && this._addTimeParaJogo(this._timeProximo)) {
            this.removeTimeProximo();
            return true;
        }
        return false;
    }

    addDescansoParaJogo() {
        if (this._timeDescanso.getTotalJogadores() === this._limiteJogadoresTime && this._addTimeParaJogo(this._timeDescanso)) {
            this.removeTimeDescanso();
            return true;
        }
        return false;
    }

    removeTimeVerde() {
        const time = this._timeVerde.time;
        this.setTimeVerde(new Time());
        return time;
    }

    removeTimeAzul() {
        const time = this._timeAzul.time;
        this.setTimeAzul(new Time());
        return time;
    }

    removeTimeProximo() {
        const time = this._timeProximo;
        this.setTimeProximo(new Time());
        return time;
    }

    removeTimeDescanso() {
        const time = this._timeDescanso;
        this.setTimeDescanso(new Time());
        return time;
    }

    _addTimeParaJogo(time) {
        if (this._timeVerde.time.getTotalJogadores() === 0) {
            this._timeVerde.time = time;
            this._timeVerde.time.setNome('Time Verde');
            return true;
        } else if (this._timeAzul.time.getTotalJogadores() === 0) {
            this._timeAzul.time = time;
            this._timeAzul.time.setNome('Time Azul');
            return true;
        }
        return false;
    }

    _validarAddJogador(jogador) {
        return this._verificaJogadores(jogador, this.getTimeVerde()) &&
            this._verificaJogadores(jogador, this.getTimeAzul()) &&
            this._verificaJogadores(jogador, this.getTimeDescanso()) &&
            this._verificaJogadores(jogador, this.getTimeProximo()) &&
            this._verificaJogadores(jogador, this.getFilaEspera());
    }

    _verificaJogadores(jogador, grupo) {
        return !grupo.getJogadores().some(j => j.getNome() === jogador.getNome());
    }

    serializar() {
        return {
            timeVerde: {
                vitorias: this.getTimeVerde().getVitorias(),
                jogadores: this.getTimeVerde().getJogadores().map(j => ({ nome: j.getNome(), vitorias: j.getVitoria(), derrotas: j.getDerrota() }))
            },
            timeAzul: {
                vitorias: this.getTimeAzul().getVitorias(),
                jogadores: this.getTimeAzul().getJogadores().map(j => ({ nome: j.getNome(), vitorias: j.getVitoria(), derrotas: j.getDerrota() }))
            },
            timeProximo: this.getTimeProximo().getJogadores().map(j => ({ nome: j.getNome(), vitorias: j.getVitoria(), derrotas: j.getDerrota() })),
            // Corrigido: Agora salva as vitórias do time de descanso
            timeDescanso: {
                vitorias: this.getTimeDescanso().getVitorias(),
                jogadores: this.getTimeDescanso().getJogadores().map(j => ({ nome: j.getNome(), vitorias: j.getVitoria(), derrotas: j.getDerrota() }))
            },
            filaEspera: this.getFilaEspera().getJogadores().map(j => ({ nome: j.getNome(), vitorias: j.getVitoria(), derrotas: j.getDerrota() })),
            vitoriasDescansoVerde: this.getVitoriasVerde(),
            vitoriasDescansoAzul: this.getVitoriasAzul()
        };
    }

    desserializar(dados) {
        this.setTimeVerde(new Time());
        if (dados.timeVerde) {
            this.getTimeVerde().setVitorias(dados.timeVerde.vitorias);
            dados.timeVerde.jogadores.forEach(j => this.getTimeVerde().addJogador(new Jogador(j.nome, j.vitorias, j.derrotas)));
        }

        this.setTimeAzul(new Time());
        if (dados.timeAzul) {
            this.getTimeAzul().setVitorias(dados.timeAzul.vitorias);
            dados.timeAzul.jogadores.forEach(j => this.getTimeAzul().addJogador(new Jogador(j.nome, j.vitorias, j.derrotas)));
        }

        this.setTimeProximo(new Time());
        if (dados.timeProximo) {
            dados.timeProximo.forEach(j => this.getTimeProximo().addJogador(new Jogador(j.nome, j.vitorias, j.derrotas)));
        }

        this.setTimeDescanso(new Time());
        if (dados.timeDescanso) {
            // Corrigido: Agora restaura as vitórias do time de descanso
            this.getTimeDescanso().setVitorias(dados.timeDescanso.vitorias);
            dados.timeDescanso.jogadores.forEach(j => this.getTimeDescanso().addJogador(new Jogador(j.nome, j.vitorias, j.derrotas)));
        }

        this._setFilaEspera(new Fila());
        if (dados.filaEspera) {
            dados.filaEspera.forEach(j => this.getFilaEspera().addJogador(new Jogador(j.nome, j.vitorias, j.derrotas)));
        }

        if (dados.vitoriasDescansoVerde) {
            this._timeVerde.vitorias = dados.vitoriasDescansoVerde;
        }
        if (dados.vitoriasDescansoAzul) {
            this._timeAzul.vitorias = dados.vitoriasDescansoAzul;
        }
    }
}

export default Quadra;

import Grupo from './grupo.js';

class Time extends Grupo {
    _vitorias = 0;

    addJogador(jogador) {
        if (this._jogadores.length < this.getQuadra().getLimiteJogadoresTime()) {
            return super.addJogador(jogador);
        }
        return false;
    }

    removeJogadores() {
        const jogadores = this._jogadores;
        this._jogadores = [];
        return jogadores;
    }

    addVitoria() {
        return ++this._vitorias;
    }

    getVitorias() {
        return this._vitorias;
    }

    // Adicionado: Agora é possível definir o número de vitórias do time
    setVitorias(vitorias) {
        this._vitorias = vitorias;
    }
}

export default Time;

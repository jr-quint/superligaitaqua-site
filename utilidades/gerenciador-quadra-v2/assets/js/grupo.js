import Jogador from './jogador.js';

class Grupo {
    _jogadores = [];
    _nome = '';
    _quadra = null;

    constructor(nome = '', quadra = null) {
        this._nome = nome;
        this._quadra = quadra;
    }

    getNome() {
        return this._nome;
    }

    setNome(nome) {
        this._nome = nome;
    }

    getQuadra() {
        return this._quadra;
    }

    setQuadra(quadra) {
        this._quadra = quadra;
    }

    /**
     * @returns {Array<Jogador>}
     */
    getJogadores() {
        return this._jogadores;
    }

    getTotalJogadores() {
        return this._jogadores.length;
    }

    /**
     * @param {Jogador} jogador
     * @returns
     */
    addJogador(jogador) {
        jogador.setGrupo(this);
        this._jogadores.push(jogador);
        return true;
    }

    /**
     * @param {Jogador} jogador
     * @returns {Jogador|null}
     */
    removeJogador(jogador) {
        const index = this._jogadores.indexOf(jogador);
        if (index !== -1) {
            return this._jogadores.splice(index, 1);
        }
        return null;
    }

    /**
     * Move um jogador do grupo atual para outro grupo
     * @param {Jogador} jogador
     * @param {Grupo} grupo
     */
    moverJogador(jogador, grupo) {
        if (grupo.addJogador(jogador)) {
            this.removeJogador(jogador);
        }
    }

}

export default Grupo;

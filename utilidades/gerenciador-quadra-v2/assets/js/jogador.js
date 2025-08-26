class Jogador {
    _nome = '';
    _vitorias = 0;
    _derrotas = 0;
    _grupo;

    constructor(nome, vitorias = 0, derrotas = 0) {
        this._nome = nome;
        this._vitorias = vitorias;
        this._derrotas = derrotas;
        this._grupo = null;
    }

    getNome() {
        return this._nome;
    }

    setGrupo(grupo) {
        this._grupo = grupo;
    }

    getGrupo() {
        return this._grupo;
    }

    addVitoria() {
        return ++this._vitorias;
    }

    getVitoria() {
        return this._vitorias;
    }

    addDerrota() {
        return ++this._derrotas;
    }

    getDerrota() {
        return this._derrotas;
    }

    getSaldo() {
        return this._vitorias - this._derrotas;
    }
}

export default Jogador;

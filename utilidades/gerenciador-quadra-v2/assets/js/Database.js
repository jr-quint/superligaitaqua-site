export default class Database {
    constructor(dbName = 'gerenciadorQuadraDB', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async abrirConexao() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                if (!this.db.objectStoreNames.contains('dadosQuadra')) {
                    this.db.createObjectStore('dadosQuadra', { keyPath: 'id' });
                }

                if (!this.db.objectStoreNames.contains('vitoriasTimes')) {
                    this.db.createObjectStore('vitoriasTimes', { autoIncrement: true });
                }

                if (!this.db.objectStoreNames.contains('jogadores')) {
                    this.db.createObjectStore('jogadores', { keyPath: 'nome' });
                }
            };


            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("Erro ao abrir o IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async salvarDados(dados) {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['dadosQuadra'], 'readwrite');
            const store = transaction.objectStore('dadosQuadra');
            const request = store.put({ id: 'quadraState', ...dados });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error("Erro ao salvar dados:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async carregarDados() {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['dadosQuadra'], 'readonly');
            const store = transaction.objectStore('dadosQuadra');
            const request = store.get('quadraState');

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error("Erro ao carregar dados:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async resetarDados() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close();
                this.db = null;
            }

            const request = indexedDB.deleteDatabase(this.dbName);

            request.onsuccess = () => {
                console.log("Banco de dados resetado com sucesso.");
                resolve();
            };

            request.onerror = (event) => {
                console.error("Erro ao resetar o banco de dados:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async salvarJogador(jogador) {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['jogadores'], 'readwrite');
            const store = transaction.objectStore('jogadores');
            const request = store.put({
                nome: jogador.getNome(),
                vitorias: jogador.getVitoria(),
                derrotas: jogador.getDerrota()
            });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error("Erro ao salvar jogador:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async carregarTodosJogadores() {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['jogadores'], 'readonly');
            const store = transaction.objectStore('jogadores');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error("Erro ao carregar todos os jogadores:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async registrarVitoriaTime(dadosVitoria) {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['vitoriasTimes'], 'readwrite');
            const store = transaction.objectStore('vitoriasTimes');
            const request = store.add(dadosVitoria);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error("Erro ao registrar vitória do time:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    async carregarHistoricoVitorias() {
        if (!this.db) {
            await this.abrirConexao();
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['vitoriasTimes'], 'readonly');
            const store = transaction.objectStore('vitoriasTimes');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                console.error("Erro ao carregar histórico de vitórias:", event.target.error);
                reject(event.target.error);
            };
        });
    }


}

import Jogador from './jogador.js';
import Quadra from './quadra.js';
import Time from './time.js';

/**
 * @param {Quadra} quadra
 */
function mocks(quadra) {
    const timeDescanso = new Time('Descanso', quadra);
    timeDescanso.addJogador(new Jogador('Ana'));
    timeDescanso.addJogador(new Jogador('Levi'));
    timeDescanso.addJogador(new Jogador('Edson'));

    const timeProximo = new Time('Próximo', quadra);
    timeProximo.addJogador(new Jogador('Junior'));
    timeProximo.addJogador(new Jogador('Monica'));
    timeProximo.addJogador(new Jogador('Fabiana'));

    quadra.setJogadorFila(new Jogador('Rafael'));
    quadra.setJogadorFila(new Jogador('Nicolas'));

    quadra.setJogadorTimeVerde(new Jogador('Cezar'));
    quadra.setJogadorTimeVerde(new Jogador('Felipe'));
    quadra.setJogadorTimeVerde(new Jogador('Sara'));

    quadra.setJogadorTimeAzul(new Jogador('Jose'));
    quadra.setJogadorTimeAzul(new Jogador('Lucas'));
    quadra.setJogadorTimeAzul(new Jogador('Wesley'));

    quadra.setTimeDescanso(timeDescanso);

    quadra.setTimeProximo(timeProximo);
}

export default mocks;

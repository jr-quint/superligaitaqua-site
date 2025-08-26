// class Notificacao {
//     //
// }

import Quadra from './quadra.js';
import Time from './time.js';

const notificacao = {

    class:
    {
        sucesso: 'alert-success',
        falha: 'alert-danger',
        info: 'alert-info',
        aviso: 'alert-warning',
    },

    mensagem:
    {
        sucesso: {
            vitoriaVerdeRegistrada: 'Vitória para o Time Verde registrada com sucesso!',
            vitoriaAzulRegistrada: 'Vitória para o Time Azul registrada com sucesso!',
            timeProximoMovidoParaQuadra: 'Próximo time movido para a quadra com sucesso!',
            timeDescansoMovidoParaQuadra: 'Time em descanso movido para a quadra com sucesso!',
            jogadorAdicionado: 'Jogador adicionado com sucesso!',
            jogadorRemovido: 'Jogador removido com sucesso!'
        },
        falha: {
            erroAdicionarJogador: 'Erro ao adicionar novo jogador.',
            erroMoverJogador: 'Erro ao mover jogador.',
            erroMoverTimeDescanso: 'Erro ao mover Time em Descanso para a quadra.',
            erroMoverTimeProximo: 'Erro ao mover Próximo Time para a quadra.',
            jogadorNaoEncontrado: 'Jogador não encontrado.',
            timesIncompletos: 'Erro ao registrar vitória! Ambos os times devem estar com o numero máximo de jogadores.'
        },
        info: {
            moverAdversariosFila: 'Jogadores adversários movidos para a fila de espera.',
        },
        aviso: {
            timeIncompleto: 'O time está incompleto.',
            limiteJogadores: 'Limite de jogadores por equipe atingido.',
            existeJogadoresDescanso: 'Ainda existem jogadores em descanso. Remova-os para desabilitar esta função.',
        },

    }

};

export default notificacao;

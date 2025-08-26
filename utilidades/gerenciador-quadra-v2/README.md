# Gerenciador de Quadra

Este é um projeto de aplicação web para gerenciar e organizar jogos em uma quadra. A ferramenta foi desenvolvida para ajudar a formar times e gerenciar a fila de próximos, registrar placares e manter um histórico persistente de vitórias e derrotas de jogadores e times.

## Recursos Principais

- **Adicionar e Remover Jogadores**: Gerencie a lista de jogadores na fila de espera.
- **Formação de Times**: Mova jogadores da fila para times (Próximo, Descanso, Time Verde, Time Azul).
- **Registro de Partidas**: Registre vitórias do Time Verde ou Time Azul, atualizando automaticamente os placares e o status dos jogadores.
- **Rotação de Times**: Um sistema de rotação inteligente move o time vencedor para a posição de "Descanso" e o time de "Descanso" para a próxima partida, se aplicável.
- **Persistência de Dados**: Todos os dados (jogadores, estatísticas e estado da quadra) são salvos automaticamente no navegador usando IndexedDB, garantindo que não sejam perdidos ao recarregar a página.
- **Ranking de Jogadores**: Um ranking completo que exibe todos os jogadores e suas estatísticas totais de vitórias e derrotas, persistindo os dados mesmo se o jogador for removido da quadra.
- **Ranking de Times**: Um ranking que rastreia e exibe as combinações de jogadores que mais venceram partidas.
- **Reset de Dados**: Uma função para apagar todos os dados do banco de dados, permitindo um recomeço.

## Estrutura do Projeto

O projeto é composto pelos seguintes arquivos principais:

- **`index.html`**: A interface de usuário (UI) da aplicação.
- **`app.js`**: O "cérebro" da aplicação. Contém a lógica de controle da quadra, manipulação de eventos e chamadas para a persistência de dados.
- **`database.js`**: A classe responsável por toda a comunicação com o IndexedDB para salvar e carregar dados de forma persistente.
- **`quadra.js`**: A classe principal que gerencia o estado da quadra, incluindo os times e a fila de jogadores.
- **`time.js`**: A classe que representa um time e suas funcionalidades, como adicionar jogadores e registrar vitórias.
- **`jogador.js`**: A classe que representa um jogador e suas estatísticas pessoais.
- **`fila.js`**: A classe que representa a fila de espera dos jogadores.
- **`grupo.js`**: A classe-mãe de onde as classes Time e Fila herdam funcionalidades.

## Como Usar

1. Acesse https://jr-quint.github.io/gerenciador-quadra/ em seu navegador.
2. Use o campo de entrada para adicionar os nomes dos jogadores e clique em "Adicionar Jogador".
3. Mova os jogadores para as equipes desejadas com os botões disponíveis (times ou próximo).
4. Clique nos botões de vitória para registrar o resultado de uma partida.
5. Use os botões de ranking para ver as estatísticas completas.

## Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **Bootstrap**
- **JavaScript** (ES6+)
- **IndexedDB**

## Próximos Passos e Melhorias

- Permitir a edição de nomes de jogadores.
- Adicionar a possibilidade de alterar a posição de jogadores na fila.
- Melhorar a interface do usuário com mais animações e feedback visual.


document.getElementById('whatsappForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const nomeTime = document.getElementById('nomeTime').value;
    const nome1 = document.getElementById('jogador1').value;
    const nome2 = document.getElementById('jogador2').value;
    const nome3 = document.getElementById('jogador3').value;
    const nome4 = document.getElementById('jogador4').value;
    const nome5 = document.getElementById('jogador5').value;

    // Mensagem informativa
    const msgInfo = `Poderia me informar a Chave Pix, por favor?`;

    // Cria a URL para o WhatsApp com os dados
    const whatsappNumber = '5511964322730'; // Substitua pelo número de WhatsApp
    const textMessage = `*Inscrição Superliga Itaqua Vôlei* \n\n *Nome do Time:* ${nomeTime} \n\n *Jogador 1:* ${nome1} \n *Jogador 2:* ${nome2} \n *Jogador 3:* ${nome3} \n *Jogador 4:* ${nome4} \n *Jogador 5:* ${nome5} \n\n ${msgInfo}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(textMessage)}`;

    // Redireciona o usuário para o WhatsApp
    window.open(whatsappURL, '_blank');
});

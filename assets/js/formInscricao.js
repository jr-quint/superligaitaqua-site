// Telefones
function aplicarMascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d+).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d+).*/, '($1) $2');
    } else {
        value = value.replace(/^(\d*)/, '($1');
    }

    input.value = value;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.whatsapp').forEach(input => {
        input.addEventListener('input', () => aplicarMascaraTelefone(input));
    });
});

document.getElementById('whatsappForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const nomeTime = document.getElementById('nomeTime').value;

    const nome1 = document.getElementById('jogador1').value;
    const tel1 = document.getElementById('telefoneJogador1').value;

    const nome2 = document.getElementById('jogador2').value;
    const tel2 = document.getElementById('telefoneJogador2').value;

    const nome3 = document.getElementById('jogador3').value;
    const tel3 = document.getElementById('telefoneJogador3').value;

    const nome4 = document.getElementById('jogador4').value;
    const tel4 = document.getElementById('telefoneJogador4').value;

    const nome5 = document.getElementById('jogador5').value;
    const tel5 = document.getElementById('telefoneJogador5').value;

    const nome6 = document.getElementById('jogador6').value;
    const tel6 = document.getElementById('telefoneJogador6').value;

    // Mensagem informativa
    const msgInfo = `Poderia me informar a Chave Pix, por favor?`;

    // Cria a URL para o WhatsApp com os dados
    const whatsappNumber = '5511964322730';
    const textMessage = `*Inscrição Superliga Itaqua Vôlei* \n\n *Nome do Time:* ${nomeTime} \n\n *Jogador 1:* ${nome1} \n *Telefone:* ${tel1} \n\n *Jogador 2:* ${nome2} \n *Telefone:* ${tel2} \n\n *Jogador 3:* ${nome3} \n *Telefone:* ${tel3} \n\n *Jogador 4:* ${nome4} \n *Telefone:* ${tel4} \n\n *Jogador 5:* ${nome5} \n *Telefone:* ${tel5} \n\n *Jogador 6:* ${nome6} \n *Telefone:* ${tel6} \n\n ${msgInfo}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(textMessage)}`;

    // Redireciona o usuário para o WhatsApp
    window.open(whatsappURL, '_blank');
});

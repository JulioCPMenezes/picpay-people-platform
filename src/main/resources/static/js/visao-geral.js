const periodoSaudacao = document.getElementById("periodoSaudacao");

function atualizarSaudacao() {
    const horaAtual = new Date().getHours();

    if (horaAtual >= 5 && horaAtual < 12) {
        periodoSaudacao.textContent = "Bom dia";
        return;
    }

    if (horaAtual >= 12 && horaAtual < 18) {
        periodoSaudacao.textContent = "Boa tarde";
        return;
    }

    periodoSaudacao.textContent = "Boa noite";
}

atualizarSaudacao();
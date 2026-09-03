const periodoSaudacao = document.getElementById("periodoSaudacao");

const perfilContainer = document.querySelector(".perfil-container");
const botaoPerfil = document.getElementById("botaoPerfil");
const perfilDropdown = document.getElementById("perfilDropdown");

const botaoEditarPerfil = document.getElementById("botaoEditarPerfil");
const botaoSair = document.getElementById("botaoSair");

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

function abrirPerfil() {
    perfilContainer.classList.add("aberto");
    botaoPerfil.setAttribute("aria-expanded", "true");
}

function fecharPerfil() {
    perfilContainer.classList.remove("aberto");
    botaoPerfil.setAttribute("aria-expanded", "false");
}

function alternarPerfil() {
    const aberto = perfilContainer.classList.contains("aberto");

    if (aberto) {
        fecharPerfil();
        return;
    }

    abrirPerfil();
}

botaoPerfil.addEventListener("click", (event) => {
    event.stopPropagation();
    alternarPerfil();
});

perfilDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
});

document.addEventListener("click", () => {
    fecharPerfil();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        fecharPerfil();
    }
});

botaoEditarPerfil.addEventListener("click", () => {
    fecharPerfil();
});

botaoSair.addEventListener("click", () => {
    window.location.href = "./index.html";
});

atualizarSaudacao();
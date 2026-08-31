const botaoLogin = document.getElementById("botaoLogin");
const botaoCadastro = document.getElementById("botaoCadastro");

const seletor = document.querySelector(".seletor-autenticacao");

const formularioLogin = document.getElementById("formularioLogin");
const formularioCadastro = document.getElementById("formularioCadastro");

function abrirLogin() {
    seletor.classList.remove("cadastro");

    botaoLogin.classList.add("ativo");
    botaoCadastro.classList.remove("ativo");

    formularioCadastro.classList.remove("formulario-ativo");
    formularioLogin.classList.add("formulario-ativo");
}

function abrirCadastro() {
    seletor.classList.add("cadastro");

    botaoCadastro.classList.add("ativo");
    botaoLogin.classList.remove("ativo");

    formularioLogin.classList.remove("formulario-ativo");
    formularioCadastro.classList.add("formulario-ativo");
}

botaoLogin.addEventListener("click", abrirLogin);
botaoCadastro.addEventListener("click", abrirCadastro);

const botoesOlho = document.querySelectorAll(".botao-olho");

botoesOlho.forEach((botao) => {
    botao.addEventListener("click", () => {
        const idInput = botao.dataset.input;
        const input = document.getElementById(idInput);
        const icone = botao.querySelector(".icone-olho");

        if (input.type === "password") {
            input.type = "text";
            icone.src = "./img/olho-aberto.png";
            botao.setAttribute("aria-label", "Ocultar senha");
        } else {
            input.type = "password";
            icone.src = "./img/olho-fechado.png";
            botao.setAttribute("aria-label", "Mostrar senha");
        }
});
});
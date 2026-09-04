const botaoLogin =
    document.getElementById(
        "botaoLogin"
    );

const botaoCadastro =
    document.getElementById(
        "botaoCadastro"
    );

const seletor =
    document.querySelector(
        ".seletor-autenticacao"
    );

const formularioLogin =
    document.getElementById(
        "formularioLogin"
    );

const formularioCadastro =
    document.getElementById(
        "formularioCadastro"
    );

function abrirLogin() {
    seletor.classList.remove(
        "cadastro"
    );

    botaoLogin.classList.add(
        "ativo"
    );

    botaoCadastro.classList.remove(
        "ativo"
    );

    formularioCadastro.classList.remove(
        "formulario-ativo"
    );

    formularioLogin.classList.add(
        "formulario-ativo"
    );

    limparMensagem(
        formularioLogin
    );
}

function abrirCadastro() {
    seletor.classList.add(
        "cadastro"
    );

    botaoCadastro.classList.add(
        "ativo"
    );

    botaoLogin.classList.remove(
        "ativo"
    );

    formularioLogin.classList.remove(
        "formulario-ativo"
    );

    formularioCadastro.classList.add(
        "formulario-ativo"
    );

    limparMensagem(
        formularioCadastro
    );
}

function obterMensagem(formulario) {
    let mensagem =
        formulario.querySelector(
            ".mensagem-api-form"
        );

    if (!mensagem) {
        mensagem =
            document.createElement(
                "div"
            );

        mensagem.className =
            "mensagem-api-form";

        const botao =
            formulario.querySelector(
                ".botao-principal"
            );

        botao.parentElement.insertBefore(
            mensagem,
            botao
        );
    }

    return mensagem;
}

function mostrarMensagem(
    formulario,
    texto,
    tipo = "erro"
) {
    const mensagem =
        obterMensagem(
            formulario
        );

    mensagem.textContent =
        texto;

    mensagem.classList.remove(
        "sucesso",
        "erro"
    );

    mensagem.classList.add(
        tipo
    );
}

function limparMensagem(formulario) {
    const mensagem =
        formulario.querySelector(
            ".mensagem-api-form"
        );

    if (mensagem) {
        mensagem.textContent =
            "";

        mensagem.classList.remove(
            "sucesso",
            "erro"
        );
    }
}

function definirCarregamento(
    botao,
    carregando,
    textoCarregando
) {
    if (
        !botao.dataset.textoOriginal
    ) {
        botao.dataset.textoOriginal =
            botao.textContent.trim();
    }

    botao.disabled =
        carregando;

    botao.textContent =
        carregando
            ? textoCarregando
            : botao.dataset.textoOriginal;
}

botaoLogin.addEventListener(
    "click",
    abrirLogin
);

botaoCadastro.addEventListener(
    "click",
    abrirCadastro
);

const botoesOlho =
    document.querySelectorAll(
        ".botao-olho"
    );

botoesOlho.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            const idInput =
                botao.dataset.input;

            const input =
                document.getElementById(
                    idInput
                );

            const icone =
                botao.querySelector(
                    ".icone-olho"
                );

            if (
                input.type === "password"
            ) {
                input.type =
                    "text";

                icone.src =
                    "./img/olho-aberto.png";

                botao.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );
            } else {
                input.type =
                    "password";

                icone.src =
                    "./img/olho-fechado.png";

                botao.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );
            }
        }
    );
});

formularioLogin.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        limparMensagem(
            formularioLogin
        );

        const botao =
            formularioLogin.querySelector(
                ".botao-principal"
            );

        definirCarregamento(
            botao,
            true,
            "Entrando..."
        );

        try {
            const usuario =
                await window.PicPayAPI.login({
                    email:
                        document
                            .getElementById(
                                "emailLogin"
                            )
                            .value
                            .trim(),

                    senha:
                        document
                            .getElementById(
                                "senhaLogin"
                            )
                            .value
                });

            window.PicPayAPI
                .salvarUsuarioSessao(
                    usuario
                );

            localStorage.setItem(
                "picpayPeople.perfil",
                JSON.stringify(
                    usuario
                )
            );

            window.location.href =
                "./visao-geral.html";

        } catch (erro) {
            mostrarMensagem(
                formularioLogin,
                window.PicPayAPI
                    .mensagemErro(
                        erro,
                        "E-mail ou senha inválidos."
                    )
            );

        } finally {
            definirCarregamento(
                botao,
                false,
                "Entrando..."
            );
        }
    }
);

formularioCadastro.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        limparMensagem(
            formularioCadastro
        );

        const senha =
            document
                .getElementById(
                    "senhaCadastro"
                )
                .value;

        const confirmarSenha =
            document
                .getElementById(
                    "confirmarSenhaCadastro"
                )
                .value;

        if (
            senha !== confirmarSenha
        ) {
            mostrarMensagem(
                formularioCadastro,
                "As senhas não coincidem."
            );

            document
                .getElementById(
                    "confirmarSenhaCadastro"
                )
                .focus();

            return;
        }

        const botao =
            formularioCadastro.querySelector(
                ".botao-principal"
            );

        definirCarregamento(
            botao,
            true,
            "Cadastrando..."
        );

        try {
            const usuario =
                await window.PicPayAPI
                    .cadastrarUsuario({
                        nome:
                            document
                                .getElementById(
                                    "nomeCadastro"
                                )
                                .value
                                .trim(),

                        email:
                            document
                                .getElementById(
                                    "emailCadastro"
                                )
                                .value
                                .trim(),

                        cargo:
                            document
                                .getElementById(
                                    "cargoCadastro"
                                )
                                .value
                                .trim(),

                        senha
                    });

            window.PicPayAPI
                .salvarUsuarioSessao(
                    usuario
                );

            localStorage.setItem(
                "picpayPeople.perfil",
                JSON.stringify(
                    usuario
                )
            );

            window.location.href =
                "./visao-geral.html";

        } catch (erro) {
            mostrarMensagem(
                formularioCadastro,
                window.PicPayAPI
                    .mensagemErro(
                        erro,
                        "Não foi possível criar sua conta."
                    )
            );

        } finally {
            definirCarregamento(
                botao,
                false,
                "Cadastrando..."
            );
        }
    }
);

const esqueceuSenha =
    document.querySelector(
        ".esqueceu-senha"
    );

const botaoGoogle =
    document.querySelector(
        ".botao-google"
    );

esqueceuSenha?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        mostrarMensagem(
            formularioLogin,
            "A recuperação de senha não faz parte desta versão do projeto."
        );
    }
);

botaoGoogle?.addEventListener(
    "click",
    () => {

        mostrarMensagem(
            formularioLogin,
            "O login com Google não faz parte desta versão do projeto."
        );
    }
);
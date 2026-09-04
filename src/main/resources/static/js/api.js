(() => {
    const CHAVE_SESSAO = "picpayPeople.usuario";

    class ApiErro extends Error {
        constructor(mensagem, status = 0, dados = null) {
            super(mensagem);
            this.name = "ApiErro";
            this.status = status;
            this.dados = dados;
        }
    }

    function salvarUsuarioSessao(usuario) {
        if (!usuario) {
            sessionStorage.removeItem(CHAVE_SESSAO);
            return;
        }

        const usuarioSeguro = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: usuario.cargo
        };

        sessionStorage.setItem(
            CHAVE_SESSAO,
            JSON.stringify(usuarioSeguro)
        );
    }

    function obterUsuarioSessao() {
        try {
            const valor = sessionStorage.getItem(CHAVE_SESSAO);

            if (!valor) {
                return null;
            }

            return JSON.parse(valor);
        } catch {
            sessionStorage.removeItem(CHAVE_SESSAO);
            return null;
        }
    }

    function encerrarSessao() {
        sessionStorage.removeItem(CHAVE_SESSAO);
        localStorage.removeItem("picpayPeople.perfil");
    }

    function exigirSessao() {
        const usuario = obterUsuarioSessao();

        if (!usuario?.id) {
            window.location.replace("./index.html");
            return null;
        }

        return usuario;
    }

    function mensagemErro(
        erro,
        padrao = "Não foi possível concluir a operação."
    ) {
        if (erro?.dados?.mensagem) {
            const campos = erro.dados.campos;

            if (campos && typeof campos === "object") {
                const mensagens = Object
                    .values(campos)
                    .filter(Boolean);

                if (mensagens.length > 0) {
                    return mensagens.join(" ");
                }
            }

            return erro.dados.mensagem;
        }

        if (erro?.message) {
            return erro.message;
        }

        return padrao;
    }

    async function lerErro(resposta) {
        const tipo =
            resposta.headers.get("content-type") || "";

        if (tipo.includes("application/json")) {
            try {
                return await resposta.json();
            } catch {
                return null;
            }
        }

        try {
            const texto = await resposta.text();

            return texto
                ? { mensagem: texto }
                : null;
        } catch {
            return null;
        }
    }

    async function requisicao(caminho, opcoes = {}) {
        const configuracao = {
            ...opcoes,
            headers: new Headers(opcoes.headers || {})
        };

        if (
            configuracao.body &&
            !(configuracao.body instanceof FormData) &&
            !configuracao.headers.has("Content-Type")
        ) {
            configuracao.headers.set(
                "Content-Type",
                "application/json"
            );
        }

        let resposta;

        try {
            resposta = await fetch(
                caminho,
                configuracao
            );
        } catch {
            throw new ApiErro(
                "Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.",
                0,
                null
            );
        }

        if (!resposta.ok) {
            const dados =
                await lerErro(resposta);

            const mensagem =
                dados?.mensagem ||
                `Erro HTTP ${resposta.status}.`;

            throw new ApiErro(
                mensagem,
                resposta.status,
                dados
            );
        }

        if (resposta.status === 204) {
            return null;
        }

        const tipo =
            resposta.headers.get("content-type") || "";

        if (tipo.includes("application/json")) {
            return resposta.json();
        }

        if (tipo.includes("application/pdf")) {
            const blob =
                await resposta.blob();

            const disposition =
                resposta.headers.get(
                    "content-disposition"
                ) || "";

            const encontrado =
                disposition.match(
                    /filename="?([^";]+)"?/i
                );

            return {
                blob,
                nomeArquivo:
                    encontrado?.[1] ||
                    "curriculo.pdf"
            };
        }

        return resposta.text();
    }

    function json(metodo, corpo) {
        return {
            method: metodo,
            body: JSON.stringify(corpo)
        };
    }

    async function cadastrarUsuario(dados) {
        return requisicao(
            "/auth/cadastro",
            json("POST", dados)
        );
    }

    async function login(dados) {
        return requisicao(
            "/auth/login",
            json("POST", dados)
        );
    }

    async function buscarUsuario(id) {
        return requisicao(
            `/usuarios/${id}`
        );
    }

    async function atualizarUsuario(id, dados) {
        return requisicao(
            `/usuarios/${id}`,
            json("PATCH", dados)
        );
    }

    async function listarFuncionarios() {
        return requisicao(
            "/funcionarios"
        );
    }

    async function buscarFuncionarioPorId(id) {
        return requisicao(
            `/funcionarios/${id}`
        );
    }

    async function criarFuncionario(dados) {
        return requisicao(
            "/funcionarios",
            json("POST", dados)
        );
    }

    async function atualizarFuncionario(id, dados) {
        return requisicao(
            `/funcionarios/${id}`,
            json("PUT", dados)
        );
    }

    async function atualizarFuncionarioParcial(
        id,
        dados
    ) {
        return requisicao(
            `/funcionarios/${id}`,
            json("PATCH", dados)
        );
    }

    async function excluirFuncionario(id) {
        return requisicao(
            `/funcionarios/${id}`,
            {
                method: "DELETE"
            }
        );
    }

    function formularioArquivo(arquivo) {
        const dados = new FormData();

        dados.append(
            "arquivo",
            arquivo
        );

        return dados;
    }

    async function enviarCurriculo(
        funcionarioId,
        arquivo
    ) {
        return requisicao(
            `/funcionarios/${funcionarioId}/curriculo`,
            {
                method: "POST",
                body:
                    formularioArquivo(
                        arquivo
                    )
            }
        );
    }

    async function buscarCurriculo(funcionarioId) {
        return requisicao(
            `/funcionarios/${funcionarioId}/curriculo`
        );
    }

    async function substituirCurriculo(
        funcionarioId,
        arquivo
    ) {
        return requisicao(
            `/funcionarios/${funcionarioId}/curriculo`,
            {
                method: "PUT",
                body:
                    formularioArquivo(
                        arquivo
                    )
            }
        );
    }

    async function excluirCurriculo(funcionarioId) {
        return requisicao(
            `/funcionarios/${funcionarioId}/curriculo`,
            {
                method: "DELETE"
            }
        );
    }

    window.PicPayAPI = {
        ApiErro,
        cadastrarUsuario,
        login,
        buscarUsuario,
        atualizarUsuario,
        listarFuncionarios,
        buscarFuncionarioPorId,
        criarFuncionario,
        atualizarFuncionario,
        atualizarFuncionarioParcial,
        excluirFuncionario,
        enviarCurriculo,
        buscarCurriculo,
        substituirCurriculo,
        excluirCurriculo,
        salvarUsuarioSessao,
        obterUsuarioSessao,
        encerrarSessao,
        exigirSessao,
        mensagemErro
    };

    const protegidas = [
        "/visao-geral.html",
        "/candidatos.html",
        "/indicadores.html"
    ];

    if (
        protegidas.some(
            pagina =>
                window.location.pathname.endsWith(
                    pagina
                )
        )
    ) {
        exigirSessao();
    }
})();
(() => {
    const CHAVE_PERFIL = "picpayPeople.perfil";
    const CHAVE_NOTIFICACOES = "picpayPeople.notificacoes";
    const LIMITE_NOTIFICACOES = 30;

    const estado = {
        perfil: null,
        notificacoes: [],
        resolverConfirmacao: null
    };

    const referencias = {};

    function lerJSON(chave, padrao) {
        try {
            const valor = localStorage.getItem(chave);

            if (!valor) {
                return padrao;
            }

            return JSON.parse(valor);
        } catch {
            return padrao;
        }
    }

    function salvarJSON(chave, valor) {
        localStorage.setItem(
            chave,
            JSON.stringify(valor)
        );
    }

    function obterTexto(seletor, padrao) {
        const elemento = document.querySelector(seletor);

        const texto = elemento?.textContent?.trim();

        return texto || padrao;
    }

    function criarPerfilPadrao() {
        return {
            nome:
                obterTexto(
                    "#nomePerfil",
                    obterTexto(
                        "#nomeUsuario",
                        "Fulano"
                    )
                ),

            email:
                obterTexto(
                    ".perfil-dropdown-email",
                    "fulano@picpay.com"
                ),

            cargo:
                obterTexto(
                    ".perfil-textos span",
                    "People Partner"
                )
        };
    }

    function carregarPerfil() {
        const perfilSalvo =
            lerJSON(
                CHAVE_PERFIL,
                null
            );

        if (!perfilSalvo) {
            return criarPerfilPadrao();
        }

        return {
            nome:
                perfilSalvo.nome ||
                criarPerfilPadrao().nome,

            email:
                perfilSalvo.email ||
                criarPerfilPadrao().email,

            cargo:
                perfilSalvo.cargo ||
                criarPerfilPadrao().cargo
        };
    }

    function carregarNotificacoes() {
        const lista =
            lerJSON(
                CHAVE_NOTIFICACOES,
                []
            );

        return Array.isArray(lista)
            ? lista
            : [];
    }

    function injetarEstrutura() {
        const estrutura = document.createElement("div");

        estrutura.innerHTML = `
            <div
                class="ui-notificacoes"
                id="uiNotificacoes"
            >
                <div class="ui-notificacoes-topo">
                    <div>
                        <h3>Atividades</h3>
                        <p>Acompanhe as ações recentes da plataforma.</p>
                    </div>

                    <button
                        type="button"
                        class="ui-marcar-lidas"
                        id="uiMarcarLidas"
                    >
                        Marcar como lidas
                    </button>
                </div>

                <div
                    class="ui-notificacoes-lista"
                    id="uiNotificacoesLista"
                ></div>

                <div class="ui-notificacoes-rodape">
                    <button
                        type="button"
                        class="ui-limpar-historico"
                        id="uiLimparHistorico"
                    >
                        Limpar histórico
                    </button>
                </div>
            </div>

            <div
                class="ui-overlay"
                id="uiOverlay"
            ></div>

            <div
                class="ui-modal"
                id="uiModalPerfil"
            >
                <div class="ui-modal-topo">
                    <div>
                        <h2>Editar perfil</h2>
                        <p>
                            Atualize as informações exibidas na sua conta.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="ui-fechar"
                        data-ui-fechar="perfil"
                    >
                        ×
                    </button>
                </div>

                <div class="ui-perfil-apresentacao">
                    <div class="ui-perfil-avatar">
                        <img
                            src="./img/user_icon_verde.png"
                            alt=""
                        >
                    </div>

                    <div>
                        <strong id="uiPerfilNomePreview">
                            Fulano
                        </strong>

                        <span id="uiPerfilCargoPreview">
                            People Partner
                        </span>
                    </div>
                </div>

                <form id="uiFormPerfil">
                    <div class="ui-form">

                        <div class="ui-form-grupo">
                            <label for="uiPerfilNome">
                                Nome completo
                            </label>

                            <input
                                type="text"
                                id="uiPerfilNome"
                                autocomplete="name"
                                required
                            >
                        </div>

                        <div class="ui-form-grupo">
                            <label for="uiPerfilEmail">
                                E-mail
                            </label>

                            <input
                                type="email"
                                id="uiPerfilEmail"
                                autocomplete="email"
                                required
                            >
                        </div>

                        <div class="ui-form-grupo">
                            <label for="uiPerfilCargo">
                                Cargo
                            </label>

                            <input
                                type="text"
                                id="uiPerfilCargo"
                                required
                            >
                        </div>

                        <div
                            class="ui-form-erro"
                            id="uiPerfilErro"
                        ></div>

                    </div>

                    <div class="ui-modal-rodape">
                        <button
                            type="button"
                            class="ui-botao ui-botao-secundario"
                            data-ui-fechar="perfil"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="ui-botao ui-botao-principal"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </div>

            <div
                class="ui-modal"
                id="uiModalSeguranca"
            >
                <div class="ui-modal-topo">
                    <div>
                        <h2>Ambiente seguro</h2>
                        <p>
                            Cuidados importantes durante o uso da plataforma.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="ui-fechar"
                        data-ui-fechar="seguranca"
                    >
                        ×
                    </button>
                </div>

                <div class="ui-seguranca-corpo">

                    <div class="ui-seguranca-destaque">
                        <div class="ui-seguranca-destaque-icone">
                            <img
                                src="./img/cadeado_sidebar.png"
                                alt=""
                            >
                        </div>

                        <div>
                            <strong>
                                Proteja o acesso à sua conta
                            </strong>

                            <p>
                                As informações de candidatos devem ser acessadas apenas por usuários autorizados.
                            </p>
                        </div>
                    </div>

                    <div class="ui-seguranca-item">
                        <strong>Sessão individual</strong>
                        <p>
                            Evite utilizar sua conta em dispositivos compartilhados e encerre a sessão ao terminar.
                        </p>
                    </div>

                    <div class="ui-seguranca-item">
                        <strong>Dados pessoais</strong>
                        <p>
                            Utilize as informações de candidatos somente para atividades relacionadas ao processo seletivo.
                        </p>
                    </div>

                    <div class="ui-seguranca-item">
                        <strong>Credenciais</strong>
                        <p>
                            Nunca compartilhe sua senha ou outras credenciais de acesso com terceiros.
                        </p>
                    </div>

                </div>

                <div class="ui-modal-rodape">
                    <button
                        type="button"
                        class="ui-botao ui-botao-principal"
                        data-ui-fechar="seguranca"
                        style="grid-column: 1 / -1;"
                    >
                        Entendi
                    </button>
                </div>
            </div>

            <div
                class="ui-modal ui-modal-confirmacao"
                id="uiModalConfirmacao"
            >
                <div class="ui-confirmacao-conteudo">

                    <div
                        class="ui-confirmacao-icone"
                        id="uiConfirmacaoIcone"
                    >
                        ✓
                    </div>

                    <h2 id="uiConfirmacaoTitulo">
                        Confirmar ação
                    </h2>

                    <p id="uiConfirmacaoDescricao">
                        Deseja continuar?
                    </p>

                </div>

                <div class="ui-modal-rodape">

                    <button
                        type="button"
                        class="ui-botao ui-botao-secundario"
                        id="uiConfirmacaoCancelar"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="ui-botao ui-botao-principal"
                        id="uiConfirmacaoConfirmar"
                    >
                        Confirmar
                    </button>

                </div>
            </div>
        `;

        while (estrutura.firstChild) {
            document.body.appendChild(
                estrutura.firstChild
            );
        }
    }

    function mapearReferencias() {
        referencias.painelNotificacoes =
            document.getElementById(
                "uiNotificacoes"
            );

        referencias.listaNotificacoes =
            document.getElementById(
                "uiNotificacoesLista"
            );

        referencias.marcarLidas =
            document.getElementById(
                "uiMarcarLidas"
            );

        referencias.limparHistorico =
            document.getElementById(
                "uiLimparHistorico"
            );

        referencias.overlay =
            document.getElementById(
                "uiOverlay"
            );

        referencias.modalPerfil =
            document.getElementById(
                "uiModalPerfil"
            );

        referencias.formPerfil =
            document.getElementById(
                "uiFormPerfil"
            );

        referencias.perfilNome =
            document.getElementById(
                "uiPerfilNome"
            );

        referencias.perfilEmail =
            document.getElementById(
                "uiPerfilEmail"
            );

        referencias.perfilCargo =
            document.getElementById(
                "uiPerfilCargo"
            );

        referencias.perfilNomePreview =
            document.getElementById(
                "uiPerfilNomePreview"
            );

        referencias.perfilCargoPreview =
            document.getElementById(
                "uiPerfilCargoPreview"
            );

        referencias.perfilErro =
            document.getElementById(
                "uiPerfilErro"
            );

        referencias.modalSeguranca =
            document.getElementById(
                "uiModalSeguranca"
            );

        referencias.modalConfirmacao =
            document.getElementById(
                "uiModalConfirmacao"
            );

        referencias.confirmacaoTitulo =
            document.getElementById(
                "uiConfirmacaoTitulo"
            );

        referencias.confirmacaoDescricao =
            document.getElementById(
                "uiConfirmacaoDescricao"
            );

        referencias.confirmacaoIcone =
            document.getElementById(
                "uiConfirmacaoIcone"
            );

        referencias.confirmacaoCancelar =
            document.getElementById(
                "uiConfirmacaoCancelar"
            );

        referencias.confirmacaoConfirmar =
            document.getElementById(
                "uiConfirmacaoConfirmar"
            );
    }

    function aplicarPerfil() {
        const perfil =
            estado.perfil;

        document
            .querySelectorAll("#nomeUsuario")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.nome;
            });

        document
            .querySelectorAll(".perfil-textos strong")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.nome;
            });

        document
            .querySelectorAll(".perfil-textos span")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.cargo;
            });

        document
            .querySelectorAll(".perfil-dropdown-informacoes strong")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.nome;
            });

        document
            .querySelectorAll(".perfil-dropdown-email")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.email;
            });

        document
            .querySelectorAll(".perfil-dropdown-cargo")
            .forEach(elemento => {
                elemento.textContent =
                    perfil.cargo;
            });

        const nomeDropdown =
            document.getElementById(
                "nomePerfilDropdown"
            );

        const emailDropdown =
            document.getElementById(
                "emailPerfilDropdown"
            );

        const cargoDropdown =
            document.getElementById(
                "cargoPerfilDropdown"
            );

        const cargoTopo =
            document.getElementById(
                "cargoPerfilTopo"
            );

        if (nomeDropdown) {
            nomeDropdown.textContent =
                perfil.nome;
        }

        if (emailDropdown) {
            emailDropdown.textContent =
                perfil.email;
        }

        if (cargoDropdown) {
            cargoDropdown.textContent =
                perfil.cargo;
        }

        if (cargoTopo) {
            cargoTopo.textContent =
                perfil.cargo;
        }
    }

    function fecharDropdownPerfil() {
        document
            .querySelectorAll(".perfil-container")
            .forEach(container => {
                container.classList.remove(
                    "aberto"
                );
            });

        document
            .querySelectorAll("#botaoPerfil")
            .forEach(botao => {
                botao.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
    }

    function atualizarOverlay() {
        const existeModalAberto =
            document.querySelector(
                ".ui-modal.aberto"
            );

        referencias.overlay.classList.toggle(
            "ativo",
            Boolean(existeModalAberto)
        );

        document.body.classList.toggle(
            "ui-modal-aberto",
            Boolean(existeModalAberto)
        );
    }

    function abrirModal(modal) {
        fecharPainelNotificacoes();

        modal.classList.add(
            "aberto"
        );

        atualizarOverlay();
    }

    function fecharModal(modal) {
        modal.classList.remove(
            "aberto"
        );

        atualizarOverlay();
    }

    function abrirEditarPerfil() {
        fecharDropdownPerfil();

        referencias.perfilNome.value =
            estado.perfil.nome;

        referencias.perfilEmail.value =
            estado.perfil.email;

        referencias.perfilCargo.value =
            estado.perfil.cargo;

        referencias.perfilNomePreview.textContent =
            estado.perfil.nome;

        referencias.perfilCargoPreview.textContent =
            estado.perfil.cargo;

        referencias.perfilErro.textContent =
            "";

        abrirModal(
            referencias.modalPerfil
        );
    }

    function validarPerfil(perfil) {
        if (
            perfil.nome.length < 3
        ) {
            return "Digite um nome válido.";
        }

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailValido.test(
                perfil.email
            )
        ) {
            return "Digite um e-mail válido.";
        }

        if (
            perfil.cargo.length < 2
        ) {
            return "Digite um cargo válido.";
        }

        return "";
    }

    function gerarId() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`;
    }

    function simboloNotificacao(tipo) {
        const simbolos = {
            sucesso: "✓",
            info: "i",
            alerta: "!",
            erro: "×"
        };

        return simbolos[tipo] || "i";
    }

    function formatarTempo(data) {
        const momento =
            new Date(data);

        const diferenca =
            Date.now() -
            momento.getTime();

        const segundos =
            Math.floor(
                diferenca / 1000
            );

        if (segundos < 60) {
            return "Agora";
        }

        const minutos =
            Math.floor(
                segundos / 60
            );

        if (minutos < 60) {
            return `Há ${minutos} min`;
        }

        const horas =
            Math.floor(
                minutos / 60
            );

        if (horas < 24) {
            return `Há ${horas} h`;
        }

        const dias =
            Math.floor(
                horas / 24
            );

        if (dias === 1) {
            return "Ontem";
        }

        if (dias < 7) {
            return `Há ${dias} dias`;
        }

        return momento.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "short"
            }
        );
    }

    function salvarNotificacoes() {
        salvarJSON(
            CHAVE_NOTIFICACOES,
            estado.notificacoes
        );
    }

    function atualizarBadge() {
        const quantidade =
            estado.notificacoes.filter(
                notificacao =>
                    !notificacao.lida
            ).length;

        document
            .querySelectorAll(
                ".notificacao-indicador"
            )
            .forEach(badge => {
                badge.textContent =
                    quantidade > 9
                        ? "9+"
                        : String(quantidade);

                badge.classList.toggle(
                    "visivel",
                    quantidade > 0
                );
            });
    }

    function renderizarNotificacoes() {
        referencias.listaNotificacoes.innerHTML =
            "";

        if (
            estado.notificacoes.length === 0
        ) {
            const vazio =
                document.createElement(
                    "div"
                );

            vazio.className =
                "ui-notificacoes-vazio";

            vazio.innerHTML = `
                <div class="ui-notificacoes-vazio-icone">
                    <img
                        src="./img/notificacao_icon.png"
                        alt=""
                    >
                </div>

                <strong>
                    Nenhuma atividade registrada
                </strong>

                <p>
                    As ações realizadas na plataforma aparecerão aqui.
                </p>
            `;

            referencias.listaNotificacoes.appendChild(
                vazio
            );

            referencias.limparHistorico.style.display =
                "none";

            referencias.marcarLidas.style.visibility =
                "hidden";

            atualizarBadge();

            return;
        }

        referencias.limparHistorico.style.display =
            "block";

        const existeNaoLida =
            estado.notificacoes.some(
                notificacao =>
                    !notificacao.lida
            );

        referencias.marcarLidas.style.visibility =
            existeNaoLida
                ? "visible"
                : "hidden";

        estado.notificacoes.forEach(
            notificacao => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "ui-notificacao-item";

                if (!notificacao.lida) {
                    item.classList.add(
                        "nao-lida"
                    );
                }

                item.dataset.id =
                    notificacao.id;

                const icone =
                    document.createElement(
                        "div"
                    );

                icone.className =
                    `ui-notificacao-icone ${notificacao.tipo}`;

                icone.textContent =
                    simboloNotificacao(
                        notificacao.tipo
                    );

                const conteudo =
                    document.createElement(
                        "div"
                    );

                conteudo.className =
                    "ui-notificacao-conteudo";

                const titulo =
                    document.createElement(
                        "strong"
                    );

                titulo.textContent =
                    notificacao.titulo;

                const descricao =
                    document.createElement(
                        "p"
                    );

                descricao.textContent =
                    notificacao.descricao;

                const tempo =
                    document.createElement(
                        "time"
                    );

                tempo.textContent =
                    formatarTempo(
                        notificacao.data
                    );

                conteudo.append(
                    titulo,
                    descricao,
                    tempo
                );

                item.append(
                    icone,
                    conteudo
                );

                if (!notificacao.lida) {
                    const ponto =
                        document.createElement(
                            "span"
                        );

                    ponto.className =
                        "ui-notificacao-ponto";

                    item.appendChild(
                        ponto
                    );
                }

                referencias.listaNotificacoes.appendChild(
                    item
                );
            }
        );

        atualizarBadge();
    }

    function registrarNotificacao({
        titulo,
        descricao,
        tipo = "info"
    }) {
        const tiposPermitidos = [
            "sucesso",
            "info",
            "alerta",
            "erro"
        ];

        const notificacao = {
            id: gerarId(),
            titulo:
                String(
                    titulo || "Atividade"
                ),
            descricao:
                String(
                    descricao || ""
                ),
            tipo:
                tiposPermitidos.includes(
                    tipo
                )
                    ? tipo
                    : "info",
            data:
                new Date().toISOString(),
            lida: false
        };

        estado.notificacoes.unshift(
            notificacao
        );

        estado.notificacoes =
            estado.notificacoes.slice(
                0,
                LIMITE_NOTIFICACOES
            );

        salvarNotificacoes();
        renderizarNotificacoes();

        return notificacao;
    }

    function marcarTodasComoLidas() {
        estado.notificacoes =
            estado.notificacoes.map(
                notificacao => ({
                    ...notificacao,
                    lida: true
                })
            );

        salvarNotificacoes();
        renderizarNotificacoes();
    }

    function marcarNotificacaoComoLida(id) {
        estado.notificacoes =
            estado.notificacoes.map(
                notificacao => {
                    if (
                        notificacao.id !== id
                    ) {
                        return notificacao;
                    }

                    return {
                        ...notificacao,
                        lida: true
                    };
                }
            );

        salvarNotificacoes();
        renderizarNotificacoes();
    }

    function posicionarPainelNotificacoes() {
        const botao =
            document.querySelector(
                ".botao-notificacao"
            );

        if (!botao) {
            return;
        }

        const posicao =
            botao.getBoundingClientRect();

        const margem = 12;

        const largura =
            Math.min(
                370,
                window.innerWidth -
                    margem * 2
            );

        let esquerda =
            posicao.right -
            largura;

        esquerda =
            Math.max(
                margem,
                Math.min(
                    esquerda,
                    window.innerWidth -
                        largura -
                        margem
                )
            );

        referencias.painelNotificacoes.style.width =
            `${largura}px`;

        referencias.painelNotificacoes.style.left =
            `${esquerda}px`;

        referencias.painelNotificacoes.style.top =
            `${posicao.bottom + 12}px`;
    }

    function abrirPainelNotificacoes() {
        const jaAberto =
            referencias.painelNotificacoes.classList.contains(
                "aberto"
            );

        if (jaAberto) {
            fecharPainelNotificacoes();
            return;
        }

        fecharDropdownPerfil();

        posicionarPainelNotificacoes();

        referencias.painelNotificacoes.classList.add(
            "aberto"
        );
    }

    function fecharPainelNotificacoes() {
        referencias.painelNotificacoes.classList.remove(
            "aberto"
        );
    }

    function resolverConfirmacao(valor) {
        referencias.modalConfirmacao.classList.remove(
            "aberto"
        );

        atualizarOverlay();

        const resolver =
            estado.resolverConfirmacao;

        estado.resolverConfirmacao =
            null;

        if (resolver) {
            resolver(valor);
        }
    }

    function confirmarAcao({
        titulo,
        descricao,
        textoConfirmar = "Confirmar",
        perigosa = false
    }) {
        if (
            estado.resolverConfirmacao
        ) {
            estado.resolverConfirmacao(
                false
            );
        }

        referencias.confirmacaoTitulo.textContent =
            titulo;

        referencias.confirmacaoDescricao.textContent =
            descricao;

        referencias.confirmacaoConfirmar.textContent =
            textoConfirmar;

        referencias.confirmacaoIcone.textContent =
            perigosa
                ? "!"
                : "✓";

        referencias.modalConfirmacao.classList.toggle(
            "perigoso",
            perigosa
        );

        referencias.confirmacaoConfirmar.className =
            perigosa
                ? "ui-botao ui-botao-perigo"
                : "ui-botao ui-botao-principal";

        abrirModal(
            referencias.modalConfirmacao
        );

        return new Promise(resolve => {
            estado.resolverConfirmacao =
                resolve;
        });
    }

    function abrirSeguranca() {
        abrirModal(
            referencias.modalSeguranca
        );
    }

    async function salvarPerfil(event) {
        event.preventDefault();

        const novoPerfil = {
            nome:
                referencias.perfilNome
                    .value
                    .trim(),

            email:
                referencias.perfilEmail
                    .value
                    .trim(),

            cargo:
                referencias.perfilCargo
                    .value
                    .trim()
        };

        const erro =
            validarPerfil(
                novoPerfil
            );

        if (erro) {
            referencias.perfilErro.textContent =
                erro;

            return;
        }

        referencias.perfilErro.textContent =
            "";

        const confirmou =
            await confirmarAcao({
                titulo:
                    "Salvar alterações?",
                descricao:
                    "Os dados exibidos no seu perfil serão atualizados.",
                textoConfirmar:
                    "Salvar alterações"
            });

        if (!confirmou) {
            return;
        }

        estado.perfil =
            novoPerfil;

        salvarJSON(
            CHAVE_PERFIL,
            estado.perfil
        );

        aplicarPerfil();

        fecharModal(
            referencias.modalPerfil
        );

        registrarNotificacao({
            titulo:
                "Perfil atualizado",
            descricao:
                "As informações do seu perfil foram alteradas.",
            tipo:
                "sucesso"
        });
    }

    async function confirmarSaida() {
        fecharDropdownPerfil();

        const confirmou =
            await confirmarAcao({
                titulo:
                    "Deseja sair?",
                descricao:
                    "Sua sessão atual será encerrada e você voltará para a tela de login.",
                textoConfirmar:
                    "Sair",
                perigosa:
                    true
            });

        if (!confirmou) {
            return;
        }

        window.location.href =
            "./index.html";
    }

    async function limparHistorico() {
        if (
            estado.notificacoes.length === 0
        ) {
            return;
        }

        fecharPainelNotificacoes();

        const confirmou =
            await confirmarAcao({
                titulo:
                    "Limpar histórico?",
                descricao:
                    "Todas as atividades registradas nesta interface serão removidas.",
                textoConfirmar:
                    "Limpar histórico",
                perigosa:
                    true
            });

        if (!confirmou) {
            return;
        }

        estado.notificacoes = [];

        salvarNotificacoes();
        renderizarNotificacoes();
    }

    function configurarEventos() {
        document.addEventListener(
            "click",
            event => {
                const editarPerfil =
                    event.target.closest(
                        ".botao-editar-perfil"
                    );

                if (editarPerfil) {
                    event.preventDefault();
                    event.stopPropagation();

                    abrirEditarPerfil();

                    return;
                }

                const botaoSairPagina =
                    event.target.closest(
                        "#botaoSair, .botao-sair"
                    );

                if (botaoSairPagina) {
                    event.preventDefault();
                    event.stopPropagation();

                    confirmarSaida();

                    return;
                }

                const notificacao =
                    event.target.closest(
                        ".botao-notificacao"
                    );

                if (notificacao) {
                    event.preventDefault();
                    event.stopPropagation();

                    abrirPainelNotificacoes();

                    return;
                }

                const saibaMais =
                    event.target.closest(
                        ".saiba-mais"
                    );

                if (saibaMais) {
                    event.preventDefault();
                    event.stopPropagation();

                    abrirSeguranca();
                }
            },
            true
        );

        document.addEventListener(
            "click",
            event => {
                if (
                    referencias.painelNotificacoes.classList.contains(
                        "aberto"
                    ) &&
                    !event.target.closest(
                        "#uiNotificacoes"
                    ) &&
                    !event.target.closest(
                        ".botao-notificacao"
                    )
                ) {
                    fecharPainelNotificacoes();
                }
            }
        );

        referencias.formPerfil.addEventListener(
            "submit",
            salvarPerfil
        );

        referencias.perfilNome.addEventListener(
            "input",
            () => {
                referencias.perfilNomePreview.textContent =
                    referencias.perfilNome.value.trim() ||
                    "Seu nome";
            }
        );

        referencias.perfilCargo.addEventListener(
            "input",
            () => {
                referencias.perfilCargoPreview.textContent =
                    referencias.perfilCargo.value.trim() ||
                    "Seu cargo";
            }
        );

        referencias.marcarLidas.addEventListener(
            "click",
            marcarTodasComoLidas
        );

        referencias.limparHistorico.addEventListener(
            "click",
            limparHistorico
        );

        referencias.listaNotificacoes.addEventListener(
            "click",
            event => {
                const item =
                    event.target.closest(
                        ".ui-notificacao-item"
                    );

                if (!item) {
                    return;
                }

                marcarNotificacaoComoLida(
                    item.dataset.id
                );
            }
        );

        referencias.confirmacaoCancelar.addEventListener(
            "click",
            () => {
                resolverConfirmacao(
                    false
                );
            }
        );

        referencias.confirmacaoConfirmar.addEventListener(
            "click",
            () => {
                resolverConfirmacao(
                    true
                );
            }
        );

        document
            .querySelectorAll(
                "[data-ui-fechar]"
            )
            .forEach(botao => {
                botao.addEventListener(
                    "click",
                    () => {
                        const tipo =
                            botao.dataset
                                .uiFechar;

                        if (
                            tipo === "perfil"
                        ) {
                            fecharModal(
                                referencias.modalPerfil
                            );
                        }

                        if (
                            tipo ===
                            "seguranca"
                        ) {
                            fecharModal(
                                referencias.modalSeguranca
                            );
                        }
                    }
                );
            });

        referencias.overlay.addEventListener(
            "click",
            () => {
                if (
                    referencias.modalConfirmacao.classList.contains(
                        "aberto"
                    )
                ) {
                    resolverConfirmacao(
                        false
                    );

                    return;
                }

                fecharModal(
                    referencias.modalPerfil
                );

                fecharModal(
                    referencias.modalSeguranca
                );
            }
        );

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key !== "Escape"
                ) {
                    return;
                }

                fecharPainelNotificacoes();

                if (
                    referencias.modalConfirmacao.classList.contains(
                        "aberto"
                    )
                ) {
                    resolverConfirmacao(
                        false
                    );

                    return;
                }

                fecharModal(
                    referencias.modalPerfil
                );

                fecharModal(
                    referencias.modalSeguranca
                );
            }
        );

        window.addEventListener(
            "resize",
            fecharPainelNotificacoes
        );

        const principal =
            document.querySelector(
                ".principal"
            );

        if (principal) {
            principal.addEventListener(
                "scroll",
                fecharPainelNotificacoes
            );
        }
    }

    function atualizarPerfilExternamente(dados) {
        if (!dados) {
            return;
        }

        estado.perfil = {
            ...estado.perfil,
            ...dados
        };

        salvarJSON(
            CHAVE_PERFIL,
            estado.perfil
        );

        aplicarPerfil();
    }

    function iniciar() {
        injetarEstrutura();

        mapearReferencias();

        estado.perfil =
            carregarPerfil();

        estado.notificacoes =
            carregarNotificacoes();

        aplicarPerfil();

        renderizarNotificacoes();

        configurarEventos();

        window.picPayPeopleUI = {
            registrarNotificacao,
            confirmarAcao,
            atualizarPerfil:
                atualizarPerfilExternamente,

            obterPerfil() {
                return {
                    ...estado.perfil
                };
            },

            obterNotificacoes() {
                return [
                    ...estado.notificacoes
                ];
            }
        };
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );
    } else {
        iniciar();
    }
})();
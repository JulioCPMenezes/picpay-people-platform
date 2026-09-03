const estadosBrasil = [
    ["AC", "Acre"],
    ["AL", "Alagoas"],
    ["AP", "Amapá"],
    ["AM", "Amazonas"],
    ["BA", "Bahia"],
    ["CE", "Ceará"],
    ["DF", "Distrito Federal"],
    ["ES", "Espírito Santo"],
    ["GO", "Goiás"],
    ["MA", "Maranhão"],
    ["MT", "Mato Grosso"],
    ["MS", "Mato Grosso do Sul"],
    ["MG", "Minas Gerais"],
    ["PA", "Pará"],
    ["PB", "Paraíba"],
    ["PR", "Paraná"],
    ["PE", "Pernambuco"],
    ["PI", "Piauí"],
    ["RJ", "Rio de Janeiro"],
    ["RN", "Rio Grande do Norte"],
    ["RS", "Rio Grande do Sul"],
    ["RO", "Rondônia"],
    ["RR", "Roraima"],
    ["SC", "Santa Catarina"],
    ["SP", "São Paulo"],
    ["SE", "Sergipe"],
    ["TO", "Tocantins"]
];

const periodoSaudacao = document.getElementById("periodoSaudacao");

const perfilContainer = document.querySelector(".perfil-container");
const botaoPerfil = document.getElementById("botaoPerfil");
const perfilDropdown = document.getElementById("perfilDropdown");
const botaoSair = document.getElementById("botaoSair");

const overlayModal = document.getElementById("overlayModal");

const drawerNovo = document.getElementById("drawerNovo");
const drawerDetalhes = document.getElementById("drawerDetalhes");
const drawerEditar = document.getElementById("drawerEditar");

const modalAtualizacao = document.getElementById("modalAtualizacao");
const modalCurriculo = document.getElementById("modalCurriculo");
const modalExclusao = document.getElementById("modalExclusao");

const botaoNovoCandidato = document.getElementById("botaoNovoCandidato");

const corpoTabela = document.getElementById("corpoTabelaCandidatos");
const candidatosVazio = document.getElementById("candidatosVazio");

const menuAcoesFlutuante = document.getElementById("menuAcoesFlutuante");

const campoPesquisa = document.getElementById("campoPesquisa");
const filtroStatus = document.getElementById("filtroStatus");
const filtroDepartamento = document.getElementById("filtroDepartamento");
const filtroCidade = document.getElementById("filtroCidade");
const botaoLimparFiltros = document.getElementById("botaoLimparFiltros");

const resumoTodos = document.getElementById("resumoTodos");
const resumoAnalise = document.getElementById("resumoAnalise");
const resumoAprovados = document.getElementById("resumoAprovados");
const resumoReprovados = document.getElementById("resumoReprovados");
const resumoContratados = document.getElementById("resumoContratados");

const textoPaginacao = document.getElementById("textoPaginacao");
const paginaAtualElemento = document.getElementById("paginaAtual");
const paginaAnterior = document.getElementById("paginaAnterior");
const proximaPagina = document.getElementById("proximaPagina");

const formNovoCandidato = document.getElementById("formNovoCandidato");
const formEditarCandidato = document.getElementById("formEditarCandidato");
const formAtualizacaoRapida = document.getElementById("formAtualizacaoRapida");

const novoCpf = document.getElementById("novoCpf");
const novoTelefone = document.getElementById("novoTelefone");
const novoSalario = document.getElementById("novoSalario");
const novoEstado = document.getElementById("novoEstado");

const editarCpf = document.getElementById("editarCpf");
const editarTelefone = document.getElementById("editarTelefone");
const editarSalario = document.getElementById("editarSalario");
const editarEstado = document.getElementById("editarEstado");

const rapidoSalario = document.getElementById("rapidoSalario");

const areaUploadNovo = document.getElementById("areaUploadNovo");
const curriculoNovo = document.getElementById("curriculoNovo");
const arquivoNovoSelecionado = document.getElementById("arquivoNovoSelecionado");

const curriculoEditar = document.getElementById("curriculoEditar");
const botaoSubstituirCurriculo = document.getElementById("botaoSubstituirCurriculo");
const removerCurriculoEditar = document.getElementById("removerCurriculoEditar");

const curriculoCabecalho = document.getElementById("curriculoCabecalho");
const curriculoFrame = document.getElementById("curriculoFrame");
const curriculoVazio = document.getElementById("curriculoVazio");

let candidatos = [];
let candidatosFiltrados = [];
let candidatoSelecionado = null;
let paginaAtual = 1;
let arquivoNovo = null;
let arquivoEdicao = null;

const candidatosPorPagina = 10;

function atualizarSaudacao() {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
        periodoSaudacao.textContent = "Bom dia";
        return;
    }

    if (hora >= 12 && hora < 18) {
        periodoSaudacao.textContent = "Boa tarde";
        return;
    }

    periodoSaudacao.textContent = "Boa noite";
}

function preencherEstados(select) {
    estadosBrasil.forEach(([sigla, nome]) => {
        const option = document.createElement("option");

        option.value = sigla;
        option.textContent = `${sigla} - ${nome}`;

        select.appendChild(option);
    });
}

function somenteNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
}

function aplicarMascaraCpf(valor) {
    let numeros = somenteNumeros(valor).slice(0, 11);

    numeros = numeros.replace(
        /^(\d{3})(\d)/,
        "$1.$2"
    );

    numeros = numeros.replace(
        /^(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3"
    );

    numeros = numeros.replace(
        /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3-$4"
    );

    return numeros;
}

function aplicarMascaraTelefone(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return numeros.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );
    }

    if (numeros.length <= 10) {
        return numeros.replace(
            /^(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );
    }

    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );
}

function aplicarMascaraMoeda(valor) {
    const numeros = somenteNumeros(valor);

    if (!numeros) {
        return "";
    }

    const valorNumero = Number(numeros) / 100;

    return valorNumero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function converterMoedaParaNumero(valor) {
    const numeros = somenteNumeros(valor);

    if (!numeros) {
        return null;
    }

    return Number(numeros) / 100;
}

function formatarSalario(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return "--";
    }

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function montarCidadeEstado(cidade, estado) {
    const cidadeLimpa = String(cidade || "").trim();
    const estadoLimpo = String(estado || "").trim();

    if (!cidadeLimpa) {
        return "";
    }

    if (!estadoLimpo) {
        return cidadeLimpa;
    }

    return `${cidadeLimpa}, ${estadoLimpo}`;
}

function separarCidadeEstado(valor) {
    const texto = String(valor || "").trim();

    const resultado = texto.match(
        /^(.*?),\s*([A-Za-z]{2})$/
    );

    if (!resultado) {
        return {
            cidade: texto,
            estado: ""
        };
    }

    return {
        cidade: resultado[1].trim(),
        estado: resultado[2].toUpperCase()
    };
}

function normalizarStatus(status) {
    return String(status || "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
}

function textoStatus(status) {
    const statusNormalizado = normalizarStatus(status);

    const textos = {
        EM_ANALISE: "Em análise",
        APROVADO: "Aprovado",
        REPROVADO: "Reprovado",
        CONTRATADO: "Contratado"
    };

    return textos[statusNormalizado] || status || "--";
}

function classeStatus(status) {
    const statusNormalizado = normalizarStatus(status);

    const classes = {
        EM_ANALISE: "status-em-analise",
        APROVADO: "status-aprovado",
        REPROVADO: "status-reprovado",
        CONTRATADO: "status-contratado"
    };

    return classes[statusNormalizado] || "";
}

function escaparHTML(valor) {
    const elemento = document.createElement("div");

    elemento.textContent = valor ?? "";

    return elemento.innerHTML;
}

function adicionarMascaras() {
    novoCpf.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraCpf(event.target.value);
    });

    editarCpf.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraCpf(event.target.value);
    });

    novoTelefone.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraTelefone(event.target.value);
    });

    editarTelefone.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraTelefone(event.target.value);
    });

    novoSalario.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraMoeda(event.target.value);
    });

    editarSalario.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraMoeda(event.target.value);
    });

    rapidoSalario.addEventListener("input", event => {
        event.target.value =
            aplicarMascaraMoeda(event.target.value);
    });
}

function fecharPerfil() {
    perfilContainer.classList.remove("aberto");

    botaoPerfil.setAttribute(
        "aria-expanded",
        "false"
    );
}

botaoPerfil.addEventListener(
    "click",
    event => {
        event.stopPropagation();

        perfilContainer.classList.toggle("aberto");

        botaoPerfil.setAttribute(
            "aria-expanded",
            perfilContainer.classList.contains("aberto")
        );
    }
);

perfilDropdown.addEventListener(
    "click",
    event => {
        event.stopPropagation();
    }
);

botaoSair.addEventListener(
    "click",
    () => {
        window.location.href = "./index.html";
    }
);

function atualizarResumos() {
    resumoTodos.textContent =
        candidatos.length || "--";

    const emAnalise = candidatos.filter(
        candidato =>
            normalizarStatus(candidato.status) ===
            "EM_ANALISE"
    ).length;

    const aprovados = candidatos.filter(
        candidato =>
            normalizarStatus(candidato.status) ===
            "APROVADO"
    ).length;

    const reprovados = candidatos.filter(
        candidato =>
            normalizarStatus(candidato.status) ===
            "REPROVADO"
    ).length;

    const contratados = candidatos.filter(
        candidato =>
            normalizarStatus(candidato.status) ===
            "CONTRATADO"
    ).length;

    resumoAnalise.textContent =
        candidatos.length ? emAnalise : "--";

    resumoAprovados.textContent =
        candidatos.length ? aprovados : "--";

    resumoReprovados.textContent =
        candidatos.length ? reprovados : "--";

    resumoContratados.textContent =
        candidatos.length ? contratados : "--";
}

function preencherFiltro(
    select,
    valores,
    titulo
) {
    select.innerHTML =
        `<option value="">${titulo}</option>`;

    valores.forEach(valor => {
        const option =
            document.createElement("option");

        option.value = valor;
        option.textContent = valor;

        select.appendChild(option);
    });
}

function atualizarFiltrosDinamicos() {
    const departamentos = [
        ...new Set(
            candidatos
                .map(
                    candidato =>
                        candidato.departamento
                )
                .filter(Boolean)
        )
    ].sort();

    const cidades = [
        ...new Set(
            candidatos
                .map(
                    candidato =>
                        candidato.cidade
                )
                .filter(Boolean)
        )
    ].sort();

    preencherFiltro(
        filtroDepartamento,
        departamentos,
        "Departamento"
    );

    preencherFiltro(
        filtroCidade,
        cidades,
        "Cidade"
    );
}

function aplicarFiltros() {
    const pesquisa =
        campoPesquisa.value
            .trim()
            .toLowerCase();

    const status =
        filtroStatus.value;

    const departamento =
        filtroDepartamento.value;

    const cidade =
        filtroCidade.value;

    candidatosFiltrados =
        candidatos.filter(candidato => {
            const correspondePesquisa =
                !pesquisa ||
                String(candidato.nome || "")
                    .toLowerCase()
                    .includes(pesquisa) ||
                String(candidato.email || "")
                    .toLowerCase()
                    .includes(pesquisa) ||
                String(candidato.cargo || "")
                    .toLowerCase()
                    .includes(pesquisa) ||
                String(candidato.cpf || "")
                    .toLowerCase()
                    .includes(pesquisa);

            const correspondeStatus =
                !status ||
                normalizarStatus(
                    candidato.status
                ) === status;

            const correspondeDepartamento =
                !departamento ||
                candidato.departamento ===
                    departamento;

            const correspondeCidade =
                !cidade ||
                candidato.cidade === cidade;

            return (
                correspondePesquisa &&
                correspondeStatus &&
                correspondeDepartamento &&
                correspondeCidade
            );
        });

    paginaAtual = 1;

    renderizarTabela();
}

function renderizarTabela() {
    corpoTabela.innerHTML = "";

    if (candidatosFiltrados.length === 0) {
        candidatosVazio.classList.remove(
            "escondido"
        );

        textoPaginacao.textContent =
            "Nenhum candidato carregado";

        paginaAtualElemento.textContent = "1";

        return;
    }

    candidatosVazio.classList.add(
        "escondido"
    );

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                candidatosFiltrados.length /
                candidatosPorPagina
            )
        );

    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }

    const inicio =
        (paginaAtual - 1) *
        candidatosPorPagina;

    const fim =
        inicio + candidatosPorPagina;

    const candidatosPagina =
        candidatosFiltrados.slice(
            inicio,
            fim
        );

    candidatosPagina.forEach(
        candidato => {
            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <div class="candidato-identidade">

                        <div class="candidato-avatar">
                            <img
                                src="./img/user_icon_verde.png"
                                alt=""
                            >
                        </div>

                        <div>

                            <strong>
                                ${escaparHTML(candidato.nome || "--")}
                            </strong>

                            <span>
                                ID: ${escaparHTML(candidato.id ?? "--")}
                            </span>

                        </div>

                    </div>
                </td>

                <td>
                    ${escaparHTML(candidato.email || "--")}
                </td>

                <td>
                    ${escaparHTML(candidato.telefone || "--")}
                </td>

                <td>
                    ${escaparHTML(candidato.cargo || "--")}
                </td>

                <td>
                    ${escaparHTML(candidato.departamento || "--")}
                </td>

                <td>
                    ${escaparHTML(candidato.cidade || "--")}
                </td>

                <td>

                    <span
                        class="status-badge ${classeStatus(candidato.status)}"
                    >
                        ${escaparHTML(textoStatus(candidato.status))}
                    </span>

                </td>

                <td>

                    <button
                        class="acao-menu-botao"
                        type="button"
                        data-id="${escaparHTML(candidato.id)}"
                    >
                        ...
                    </button>

                </td>
            `;

            corpoTabela.appendChild(linha);
        }
    );

    textoPaginacao.textContent =
        `Mostrando ${inicio + 1} a ${Math.min(
            fim,
            candidatosFiltrados.length
        )} de ${candidatosFiltrados.length} candidatos`;

    paginaAtualElemento.textContent =
        paginaAtual;
}

function fecharMenuAcoes() {
    menuAcoesFlutuante.classList.remove(
        "aberto"
    );
}

function abrirMenuAcoes(
    botao,
    candidato
) {
    candidatoSelecionado =
        candidato;

    const posicao =
        botao.getBoundingClientRect();

    const larguraMenu = 200;
    const alturaAproximada = 205;

    let esquerda =
        posicao.right -
        larguraMenu;

    let topo =
        posicao.bottom + 7;

    if (
        topo +
        alturaAproximada >
        window.innerHeight
    ) {
        topo =
            posicao.top -
            alturaAproximada -
            7;
    }

    if (esquerda < 10) {
        esquerda = 10;
    }

    menuAcoesFlutuante.style.left =
        `${esquerda}px`;

    menuAcoesFlutuante.style.top =
        `${topo}px`;

    menuAcoesFlutuante.classList.add(
        "aberto"
    );
}

corpoTabela.addEventListener(
    "click",
    event => {
        const botao =
            event.target.closest(
                ".acao-menu-botao"
            );

        if (!botao) {
            return;
        }

        event.stopPropagation();

        const id =
            botao.dataset.id;

        const candidato =
            candidatos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!candidato) {
            return;
        }

        abrirMenuAcoes(
            botao,
            candidato
        );
    }
);

menuAcoesFlutuante.addEventListener(
    "click",
    event => {
        event.stopPropagation();

        const botao =
            event.target.closest(
                ".menu-opcao"
            );

        if (!botao) {
            return;
        }

        fecharMenuAcoes();

        const acao =
            botao.dataset.acao;

        if (acao === "detalhes") {
            abrirDetalhes();
        }

        if (acao === "editar") {
            abrirEdicao();
        }

        if (acao === "rapida") {
            abrirAtualizacaoRapida();
        }

        if (acao === "curriculo") {
            abrirCurriculo();
        }

        if (acao === "excluir") {
            abrirExclusao();
        }
    }
);

function abrirOverlay() {
    overlayModal.classList.add(
        "ativo"
    );
}

function fecharComponentes() {
    document
        .querySelectorAll(".drawer")
        .forEach(
            drawer =>
                drawer.classList.remove(
                    "aberto"
                )
        );

    document
        .querySelectorAll(".modal-central")
        .forEach(
            modal =>
                modal.classList.remove(
                    "aberto"
                )
        );

    modalCurriculo.classList.remove(
        "aberto"
    );

    overlayModal.classList.remove(
        "ativo"
    );
}

function abrirDrawer(drawer) {
    fecharComponentes();

    drawer.classList.add(
        "aberto"
    );

    abrirOverlay();
}

function abrirModal(modal) {
    fecharComponentes();

    modal.classList.add(
        "aberto"
    );

    abrirOverlay();
}

botaoNovoCandidato.addEventListener(
    "click",
    () => {
        formNovoCandidato.reset();

        arquivoNovo = null;

        arquivoNovoSelecionado.textContent =
            "";

        abrirDrawer(drawerNovo);
    }
);

document
    .querySelectorAll("[data-fechar]")
    .forEach(
        botao => {
            botao.addEventListener(
                "click",
                fecharComponentes
            );
        }
    );

overlayModal.addEventListener(
    "click",
    fecharComponentes
);

function abrirDetalhes() {
    document.getElementById(
        "detalheNome"
    ).textContent =
        candidatoSelecionado.nome || "--";

    document.getElementById(
        "detalheCargo"
    ).textContent =
        candidatoSelecionado.cargo || "--";

    document.getElementById(
        "detalheCpf"
    ).textContent =
        candidatoSelecionado.cpf || "--";

    document.getElementById(
        "detalheEmail"
    ).textContent =
        candidatoSelecionado.email || "--";

    document.getElementById(
        "detalheTelefone"
    ).textContent =
        candidatoSelecionado.telefone || "--";

    document.getElementById(
        "detalheCidade"
    ).textContent =
        candidatoSelecionado.cidade || "--";

    document.getElementById(
        "detalheCargoCompleto"
    ).textContent =
        candidatoSelecionado.cargo || "--";

    document.getElementById(
        "detalheDepartamento"
    ).textContent =
        candidatoSelecionado.departamento || "--";

    document.getElementById(
        "detalheSalario"
    ).textContent =
        formatarSalario(
            candidatoSelecionado.salario
        );

    const status =
        document.getElementById(
            "detalheStatus"
        );

    status.textContent =
        textoStatus(
            candidatoSelecionado.status
        );

    status.className =
        `status-badge ${classeStatus(
            candidatoSelecionado.status
        )}`;

    document.getElementById(
        "nomeCurriculoDetalhes"
    ).textContent =
        candidatoSelecionado.curriculoNome ||
        "Visualizar currículo";

    abrirDrawer(
        drawerDetalhes
    );
}

function abrirEdicao() {
    const endereco =
        separarCidadeEstado(
            candidatoSelecionado.cidade
        );

    document.getElementById(
        "editarNome"
    ).value =
        candidatoSelecionado.nome || "";

    editarCpf.value =
        aplicarMascaraCpf(
            candidatoSelecionado.cpf || ""
        );

    document.getElementById(
        "editarEmail"
    ).value =
        candidatoSelecionado.email || "";

    editarTelefone.value =
        aplicarMascaraTelefone(
            candidatoSelecionado.telefone || ""
        );

    document.getElementById(
        "editarCidade"
    ).value =
        endereco.cidade;

    editarEstado.value =
        candidatoSelecionado.estado ||
        endereco.estado;

    document.getElementById(
        "editarCargo"
    ).value =
        candidatoSelecionado.cargo || "";

    document.getElementById(
        "editarDepartamento"
    ).value =
        candidatoSelecionado.departamento || "";

    editarSalario.value =
        candidatoSelecionado.salario !==
        undefined &&
        candidatoSelecionado.salario !==
        null
            ? formatarSalario(
                candidatoSelecionado.salario
            )
            : "";

    document.getElementById(
        "editarStatus"
    ).value =
        normalizarStatus(
            candidatoSelecionado.status
        ) || "EM_ANALISE";

    document.getElementById(
        "arquivoEditarNome"
    ).textContent =
        candidatoSelecionado.curriculoNome ||
        "Nenhum currículo";

    arquivoEdicao = null;

    abrirDrawer(drawerEditar);
}

function abrirAtualizacaoRapida() {
    document.getElementById(
        "rapidoNome"
    ).textContent =
        candidatoSelecionado.nome || "--";

    document.getElementById(
        "rapidoCargoAtual"
    ).textContent =
        candidatoSelecionado.cargo || "--";

    document.getElementById(
        "rapidoCargo"
    ).value =
        candidatoSelecionado.cargo || "";

    document.getElementById(
        "rapidoStatus"
    ).value =
        normalizarStatus(
            candidatoSelecionado.status
        ) || "EM_ANALISE";

    rapidoSalario.value =
        candidatoSelecionado.salario !==
        undefined &&
        candidatoSelecionado.salario !==
        null
            ? formatarSalario(
                candidatoSelecionado.salario
            )
            : "";

    abrirModal(
        modalAtualizacao
    );
}

function abrirCurriculo() {
    fecharComponentes();

    const nome =
        candidatoSelecionado?.nome ||
        "Candidato";

    const arquivo =
        candidatoSelecionado?.curriculoNome ||
        "curriculo.pdf";

    document.getElementById(
        "curriculoTitulo"
    ).textContent =
        `Currículo — ${nome}`;

    document.getElementById(
        "curriculoNomeArquivo"
    ).textContent =
        arquivo;

    const url =
        candidatoSelecionado?.curriculoUrl;

    if (url) {
        curriculoFrame.src = url;

        curriculoFrame.style.display =
            "block";

        curriculoVazio.style.display =
            "none";
    } else {
        curriculoFrame.removeAttribute(
            "src"
        );

        curriculoFrame.style.display =
            "none";

        curriculoVazio.style.display =
            "flex";
    }

    modalCurriculo.style.left =
        "50%";

    modalCurriculo.style.top =
        "50%";

    modalCurriculo.style.transform =
        "translate(-50%, -50%) scale(1)";

    modalCurriculo.classList.add(
        "aberto"
    );

    abrirOverlay();
}

function abrirExclusao() {
    document.getElementById(
        "nomeCandidatoExclusao"
    ).textContent =
        candidatoSelecionado.nome ||
        "este candidato";

    abrirModal(
        modalExclusao
    );
}

document.getElementById(
    "botaoEditarDetalhes"
).addEventListener(
    "click",
    abrirEdicao
);

document.getElementById(
    "botaoAtualizacaoDetalhes"
).addEventListener(
    "click",
    abrirAtualizacaoRapida
);

document.getElementById(
    "botaoAbrirCurriculoDetalhes"
).addEventListener(
    "click",
    abrirCurriculo
);

function validarArquivoPdf(file) {
    if (!file) {
        return false;
    }

    const ehPdf =
        file.type ===
            "application/pdf" ||
        file.name
            .toLowerCase()
            .endsWith(".pdf");

    if (!ehPdf) {
        return false;
    }

    const limite =
        10 *
        1024 *
        1024;

    return file.size <= limite;
}

function selecionarArquivoNovo(file) {
    if (!validarArquivoPdf(file)) {
        arquivoNovo = null;

        arquivoNovoSelecionado.textContent =
            "Selecione um PDF de até 10MB.";

        return;
    }

    arquivoNovo = file;

    arquivoNovoSelecionado.textContent =
        file.name;

    try {
        const transferencia =
            new DataTransfer();

        transferencia.items.add(file);

        curriculoNovo.files =
            transferencia.files;
    } catch {
    }
}

areaUploadNovo.addEventListener(
    "click",
    () => {
        curriculoNovo.click();
    }
);

curriculoNovo.addEventListener(
    "change",
    () => {
        selecionarArquivoNovo(
            curriculoNovo.files[0]
        );
    }
);

areaUploadNovo.addEventListener(
    "dragover",
    event => {
        event.preventDefault();

        areaUploadNovo.classList.add(
            "arrastando"
        );
    }
);

areaUploadNovo.addEventListener(
    "dragleave",
    () => {
        areaUploadNovo.classList.remove(
            "arrastando"
        );
    }
);

areaUploadNovo.addEventListener(
    "drop",
    event => {
        event.preventDefault();

        areaUploadNovo.classList.remove(
            "arrastando"
        );

        selecionarArquivoNovo(
            event.dataTransfer.files[0]
        );
    }
);

botaoSubstituirCurriculo.addEventListener(
    "click",
    () => {
        curriculoEditar.click();
    }
);

curriculoEditar.addEventListener(
    "change",
    () => {
        const file =
            curriculoEditar.files[0];

        if (!validarArquivoPdf(file)) {
            return;
        }

        arquivoEdicao = file;

        document.getElementById(
            "arquivoEditarNome"
        ).textContent =
            file.name;
    }
);

removerCurriculoEditar.addEventListener(
    "click",
    () => {
        arquivoEdicao = null;

        curriculoEditar.value = "";

        document.getElementById(
            "arquivoEditarNome"
        ).textContent =
            "Nenhum currículo";
    }
);

function obterDadosNovoCandidato() {
    return {
        nome:
            document.getElementById(
                "novoNome"
            ).value.trim(),

        cpf:
            novoCpf.value,

        email:
            document.getElementById(
                "novoEmail"
            ).value.trim(),

        telefone:
            novoTelefone.value,

        cidade:
            montarCidadeEstado(
                document.getElementById(
                    "novaCidade"
                ).value,
                novoEstado.value
            ),

        cargo:
            document.getElementById(
                "novoCargo"
            ).value.trim(),

        departamento:
            document.getElementById(
                "novoDepartamento"
            ).value.trim(),

        salario:
            converterMoedaParaNumero(
                novoSalario.value
            ),

        status:
            document.getElementById(
                "novoStatus"
            ).value
    };
}

function obterDadosEdicao() {
    return {
        id:
            candidatoSelecionado?.id,

        nome:
            document.getElementById(
                "editarNome"
            ).value.trim(),

        cpf:
            editarCpf.value,

        email:
            document.getElementById(
                "editarEmail"
            ).value.trim(),

        telefone:
            editarTelefone.value,

        cidade:
            montarCidadeEstado(
                document.getElementById(
                    "editarCidade"
                ).value,
                editarEstado.value
            ),

        cargo:
            document.getElementById(
                "editarCargo"
            ).value.trim(),

        departamento:
            document.getElementById(
                "editarDepartamento"
            ).value.trim(),

        salario:
            converterMoedaParaNumero(
                editarSalario.value
            ),

        status:
            document.getElementById(
                "editarStatus"
            ).value
    };
}

function obterDadosPatch() {
    return {
        cargo:
            document.getElementById(
                "rapidoCargo"
            ).value.trim(),

        status:
            document.getElementById(
                "rapidoStatus"
            ).value,

        salario:
            converterMoedaParaNumero(
                rapidoSalario.value
            )
    };
}

formNovoCandidato.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        obterDadosNovoCandidato();
    }
);

formEditarCandidato.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        obterDadosEdicao();
    }
);

formAtualizacaoRapida.addEventListener(
    "submit",
    event => {
        event.preventDefault();

        obterDadosPatch();
    }
);

document.getElementById(
    "confirmarExclusao"
).addEventListener(
    "click",
    () => {
    }
);

campoPesquisa.addEventListener(
    "input",
    aplicarFiltros
);

filtroStatus.addEventListener(
    "change",
    aplicarFiltros
);

filtroDepartamento.addEventListener(
    "change",
    aplicarFiltros
);

filtroCidade.addEventListener(
    "change",
    aplicarFiltros
);

botaoLimparFiltros.addEventListener(
    "click",
    () => {
        campoPesquisa.value = "";
        filtroStatus.value = "";
        filtroDepartamento.value = "";
        filtroCidade.value = "";

        document
            .querySelectorAll(
                ".resumo-item"
            )
            .forEach(
                item =>
                    item.classList.remove(
                        "ativo"
                    )
            );

        document
            .querySelector(
                '[data-resumo-status=""]'
            )
            .classList.add(
                "ativo"
            );

        aplicarFiltros();
    }
);

document
    .querySelectorAll(
        ".resumo-item"
    )
    .forEach(
        botao => {
            botao.addEventListener(
                "click",
                () => {
                    document
                        .querySelectorAll(
                            ".resumo-item"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "ativo"
                                )
                        );

                    botao.classList.add(
                        "ativo"
                    );

                    filtroStatus.value =
                        botao.dataset
                            .resumoStatus;

                    aplicarFiltros();
                }
            );
        }
    );

paginaAnterior.addEventListener(
    "click",
    () => {
        if (paginaAtual <= 1) {
            return;
        }

        paginaAtual--;

        renderizarTabela();
    }
);

proximaPagina.addEventListener(
    "click",
    () => {
        const totalPaginas =
            Math.ceil(
                candidatosFiltrados.length /
                candidatosPorPagina
            );

        if (
            paginaAtual >=
            totalPaginas
        ) {
            return;
        }

        paginaAtual++;

        renderizarTabela();
    }
);

let arrastandoCurriculo = false;
let inicioMouseX = 0;
let inicioMouseY = 0;
let inicioModalX = 0;
let inicioModalY = 0;

curriculoCabecalho.addEventListener(
    "mousedown",
    event => {
        if (
            event.target.closest(
                "button"
            )
        ) {
            return;
        }

        const rect =
            modalCurriculo
                .getBoundingClientRect();

        modalCurriculo.style.transform =
            "none";

        modalCurriculo.style.left =
            `${rect.left}px`;

        modalCurriculo.style.top =
            `${rect.top}px`;

        arrastandoCurriculo = true;

        inicioMouseX =
            event.clientX;

        inicioMouseY =
            event.clientY;

        inicioModalX =
            rect.left;

        inicioModalY =
            rect.top;
    }
);

document.addEventListener(
    "mousemove",
    event => {
        if (!arrastandoCurriculo) {
            return;
        }

        const diferencaX =
            event.clientX -
            inicioMouseX;

        const diferencaY =
            event.clientY -
            inicioMouseY;

        modalCurriculo.style.left =
            `${
                inicioModalX +
                diferencaX
            }px`;

        modalCurriculo.style.top =
            `${
                inicioModalY +
                diferencaY
            }px`;
    }
);

document.addEventListener("mouseup", () => {
        arrastandoCurriculo = false;
    }
);

document.addEventListener("click", event => {
        if (!event.target.closest(".acao-menu-botao") && !event.target.closest("#menuAcoesFlutuante")) {
            fecharMenuAcoes();
        }

        if (!event.target.closest(".perfil-container")) {
            fecharPerfil();
        }
    }
);

document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fecharMenuAcoes();
            fecharPerfil();
            fecharComponentes();
        }
    }
);

window.addEventListener("resize", fecharMenuAcoes);

document.querySelector(".principal").addEventListener("scroll", fecharMenuAcoes);

window.definirCandidatos = lista => {
        candidatos = Array.isArray(lista) ? lista : [];
        candidatosFiltrados = [...candidatos];

        atualizarResumos();
        atualizarFiltrosDinamicos();
        aplicarFiltros();
    };

window.picPayPeopleForms = {
    obterDadosNovoCandidato,
    obterDadosEdicao,
    obterDadosPatch,

    obterArquivoNovo() {
        return arquivoNovo;
    },

    obterArquivoEdicao() {
        return arquivoEdicao;
    },

    obterCandidatoSelecionado() {
        return candidatoSelecionado;
    }
};

const parametros = new URLSearchParams(window.location.search);

preencherEstados(novoEstado);
preencherEstados(editarEstado);

adicionarMascaras();

atualizarSaudacao();
atualizarResumos();
atualizarFiltrosDinamicos();
aplicarFiltros();

if (parametros.get("acao") ==="novo") {
    setTimeout(() => {botaoNovoCandidato.click();}, 100);
}
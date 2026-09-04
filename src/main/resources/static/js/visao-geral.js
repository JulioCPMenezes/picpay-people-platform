const periodoSaudacao =
    document.getElementById(
        "periodoSaudacao"
    );

const perfilContainer =
    document.querySelector(
        ".perfil-container"
    );

const botaoPerfil =
    document.getElementById(
        "botaoPerfil"
    );

const perfilDropdown =
    document.getElementById(
        "perfilDropdown"
    );

function atualizarSaudacao() {
    const horaAtual =
        new Date().getHours();

    if (
        horaAtual >= 5 &&
        horaAtual < 12
    ) {
        periodoSaudacao.textContent =
            "Bom dia";

        return;
    }

    if (
        horaAtual >= 12 &&
        horaAtual < 18
    ) {
        periodoSaudacao.textContent =
            "Boa tarde";

        return;
    }

    periodoSaudacao.textContent =
        "Boa noite";
}

function abrirPerfil() {
    perfilContainer.classList.add(
        "aberto"
    );

    botaoPerfil.setAttribute(
        "aria-expanded",
        "true"
    );
}

function fecharPerfil() {
    perfilContainer.classList.remove(
        "aberto"
    );

    botaoPerfil.setAttribute(
        "aria-expanded",
        "false"
    );
}

function alternarPerfil() {
    if (
        perfilContainer
            .classList
            .contains(
                "aberto"
            )
    ) {
        fecharPerfil();

        return;
    }

    abrirPerfil();
}

function normalizarStatus(status) {
    return String(
        status || ""
    )
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /\s+/g,
            "_"
        );
}

function textoStatus(status) {
    const mapa = {
        EM_ANALISE:
            "Em análise",

        APROVADO:
            "Aprovado",

        REPROVADO:
            "Reprovado",

        CONTRATADO:
            "Contratado"
    };

    return (
        mapa[
            normalizarStatus(
                status
            )
        ] ||
        "--"
    );
}

function classeStatus(status) {
    const mapa = {
        EM_ANALISE:
            "analise",

        APROVADO:
            "aprovado",

        REPROVADO:
            "reprovado",

        CONTRATADO:
            "contratado"
    };

    return (
        mapa[
            normalizarStatus(
                status
            )
        ] ||
        ""
    );
}

function formatarData(valor) {
    if (!valor) {
        return "--";
    }

    const data =
        new Date(
            valor
        );

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {
        return "--";
    }

    return data
        .toLocaleDateString(
            "pt-BR"
        );
}

function contarStatus(
    lista,
    status
) {
    return lista
        .filter(
            candidato =>
                normalizarStatus(
                    candidato.status
                ) ===
                status
        )
        .length;
}

function atualizarDonut(
    total,
    emAnalise,
    aprovados,
    reprovados,
    contratados
) {
    const donut =
        document.querySelector(
            ".grafico-donut"
        );

    if (!donut) {
        return;
    }

    if (total === 0) {
        donut.style.background =
            "conic-gradient(#E5E9E7 0deg 360deg)";

        return;
    }

    const valores = [
        [
            emAnalise,
            "#3D8CFF"
        ],
        [
            aprovados,
            "#03624C"
        ],
        [
            reprovados,
            "#EE3E42"
        ],
        [
            contratados,
            "#11C76F"
        ]
    ];

    let inicio =
        0;

    const partes =
        valores.map(
            ([quantidade, cor]) => {

                const fim =
                    inicio +
                    (
                        quantidade /
                        total
                    ) *
                    360;

                const parte =
                    `${cor} ${inicio}deg ${fim}deg`;

                inicio =
                    fim;

                return parte;
            }
        );

    donut.style.background =
        `conic-gradient(${partes.join(", ")})`;
}

function renderizarTabelaRecentes(
    lista
) {
    const tabela =
        document.getElementById(
            "tabelaCandidatos"
        );

    tabela.innerHTML =
        "";

    if (
        lista.length === 0
    ) {
        tabela.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="5">

                    <div class="estado-vazio">

                        <div class="estado-vazio-icone">
                            <img
                                src="./img/user_icon_verde.png"
                                alt=""
                            >
                        </div>

                        <div>

                            <strong>
                                Nenhum candidato carregado
                            </strong>

                            <p>
                                Os candidatos aparecerão aqui quando os dados forem carregados.
                            </p>

                        </div>

                    </div>

                </td>
            </tr>
        `;

        return;
    }

    const recentes = [
        ...lista
    ]
        .sort(
            (a, b) => {

                const dataA =
                    new Date(
                        a.dataAtualizado ||
                        a.dataCadastro ||
                        0
                    ).getTime();

                const dataB =
                    new Date(
                        b.dataAtualizado ||
                        b.dataCadastro ||
                        0
                    ).getTime();

                if (
                    dataA !== dataB
                ) {
                    return (
                        dataB -
                        dataA
                    );
                }

                return (
                    Number(
                        b.id ||
                        0
                    ) -
                    Number(
                        a.id ||
                        0
                    )
                );
            }
        )
        .slice(
            0,
            5
        );

    recentes.forEach(
        candidato => {

            const linha =
                document.createElement(
                    "tr"
                );

            const candidatoCelula =
                document.createElement(
                    "td"
                );

            const nome =
                document.createElement(
                    "strong"
                );

            nome.className =
                "dashboard-candidato-nome";

            nome.textContent =
                candidato.nome ||
                "--";

            candidatoCelula.appendChild(
                nome
            );

            const cargo =
                document.createElement(
                    "td"
                );

            cargo.textContent =
                candidato.cargo ||
                "--";

            const departamento =
                document.createElement(
                    "td"
                );

            departamento.textContent =
                candidato.departamento ||
                "--";

            const statusCelula =
                document.createElement(
                    "td"
                );

            const status =
                document.createElement(
                    "span"
                );

            status.className =
                `dashboard-status ${classeStatus(
                    candidato.status
                )}`;

            status.textContent =
                textoStatus(
                    candidato.status
                );

            statusCelula.appendChild(
                status
            );

            const atualizado =
                document.createElement(
                    "td"
                );

            atualizado.textContent =
                formatarData(
                    candidato.dataAtualizado ||
                    candidato.dataCadastro
                );

            linha.append(
                candidatoCelula,
                cargo,
                departamento,
                statusCelula,
                atualizado
            );

            tabela.appendChild(
                linha
            );
        }
    );
}

function definirVisaoGeral(
    lista
) {
    const candidatos =
        Array.isArray(
            lista
        )
            ? lista
            : [];

    const total =
        candidatos.length;

    const emAnalise =
        contarStatus(
            candidatos,
            "EM_ANALISE"
        );

    const aprovados =
        contarStatus(
            candidatos,
            "APROVADO"
        );

    const reprovados =
        contarStatus(
            candidatos,
            "REPROVADO"
        );

    const contratados =
        contarStatus(
            candidatos,
            "CONTRATADO"
        );

    document.getElementById(
        "totalCandidatos"
    ).textContent =
        total;

    document.getElementById(
        "totalEmAnalise"
    ).textContent =
        emAnalise;

    document.getElementById(
        "totalAprovados"
    ).textContent =
        aprovados;

    document.getElementById(
        "totalReprovados"
    ).textContent =
        reprovados;

    document.getElementById(
        "totalContratados"
    ).textContent =
        contratados;

    document.getElementById(
        "graficoTotal"
    ).textContent =
        total;

    document.getElementById(
        "graficoEmAnalise"
    ).textContent =
        emAnalise;

    document.getElementById(
        "graficoAprovados"
    ).textContent =
        aprovados;

    document.getElementById(
        "graficoReprovados"
    ).textContent =
        reprovados;

    document.getElementById(
        "graficoContratados"
    ).textContent =
        contratados;

    atualizarDonut(
        total,
        emAnalise,
        aprovados,
        reprovados,
        contratados
    );

    renderizarTabelaRecentes(
        candidatos
    );
}

async function carregarVisaoGeral() {
    try {
        const candidatos =
            await window.PicPayAPI
                .listarFuncionarios();

        definirVisaoGeral(
            candidatos
        );

    } catch (erro) {
        definirVisaoGeral(
            []
        );

        console.error(
            window.PicPayAPI
                .mensagemErro(
                    erro
                )
        );
    }
}

botaoPerfil.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        alternarPerfil();
    }
);

perfilDropdown.addEventListener(
    "click",
    event => {
        event.stopPropagation();
    }
);

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".perfil-container"
            )
        ) {
            fecharPerfil();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {
            fecharPerfil();
        }
    }
);

window.definirVisaoGeral =
    definirVisaoGeral;

atualizarSaudacao();

carregarVisaoGeral();
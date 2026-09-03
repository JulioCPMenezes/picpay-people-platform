const periodoSaudacao = document.getElementById("periodoSaudacao");

const perfilContainer = document.querySelector(".perfil-container");
const botaoPerfil = document.getElementById("botaoPerfil");
const perfilDropdown = document.getElementById("perfilDropdown");
const botaoSair = document.getElementById("botaoSair");

const totalCandidatosElemento = document.getElementById("totalCandidatos");
const totalEmAnaliseElemento = document.getElementById("totalEmAnalise");
const totalAprovadosElemento = document.getElementById("totalAprovados");
const totalReprovadosElemento = document.getElementById("totalReprovados");
const totalContratadosElemento = document.getElementById("totalContratados");

const totalCentro = document.getElementById("totalCentro");

const legendaAnalise = document.getElementById("legendaAnalise");
const legendaAprovados = document.getElementById("legendaAprovados");
const legendaReprovados = document.getElementById("legendaReprovados");
const legendaContratados = document.getElementById("legendaContratados");

const taxaAprovacao = document.getElementById("taxaAprovacao");
const taxaContratacao = document.getElementById("taxaContratacao");
const salarioMedio = document.getElementById("salarioMedio");
const quantidadeDepartamentos = document.getElementById("quantidadeDepartamentos");

const vazioStatus = document.getElementById("vazioStatus");
const vazioDepartamentos = document.getElementById("vazioDepartamentos");
const vazioCargos = document.getElementById("vazioCargos");
const vazioCidades = document.getElementById("vazioCidades");
const vazioSalarios = document.getElementById("vazioSalarios");

let graficoStatus = null;
let graficoDepartamentos = null;
let graficoCargos = null;
let graficoCidades = null;
let graficoSalarios = null;

const cores = {
    verdeEscuro: "#03624C",
    verdeClaro: "#11C76F",
    azul: "#3D8CFF",
    vermelho: "#EE3E42",
    cinza: "#D9DDDB",
    texto: "rgba(0, 0, 0, 0.55)",
    grid: "rgba(0, 0, 0, 0.055)"
};

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

function fecharPerfil() {
    perfilContainer.classList.remove("aberto");

    botaoPerfil.setAttribute(
        "aria-expanded",
        "false"
    );
}

botaoPerfil.addEventListener("click", event => {
    event.stopPropagation();

    perfilContainer.classList.toggle("aberto");

    botaoPerfil.setAttribute(
        "aria-expanded",
        perfilContainer.classList.contains("aberto")
    );
});

perfilDropdown.addEventListener("click", event => {
    event.stopPropagation();
});

document.addEventListener("click", event => {
    if (!event.target.closest(".perfil-container")) {
        fecharPerfil();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharPerfil();
    }
});

botaoSair.addEventListener("click", () => {
    window.location.href = "./index.html";
});

function normalizarStatus(status) {
    return String(status || "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
}

function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString("pt-BR");
}

function formatarPercentual(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + "%";
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function obterSalario(candidato) {
    const salario = Number(candidato?.salario);

    if (
        !Number.isFinite(salario) ||
        salario < 0
    ) {
        return null;
    }

    return salario;
}

function contarPorCampo(lista, campo) {
    const resultado = {};

    lista.forEach(item => {
        const valor = String(
            item?.[campo] || ""
        ).trim();

        if (!valor) {
            return;
        }

        resultado[valor] =
            (resultado[valor] || 0) + 1;
    });

    return resultado;
}

function ordenarContagens(objeto, limite = 7) {
    return Object
        .entries(objeto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limite);
}

function calcularMediaSalarialPorDepartamento(candidatos) {
    const departamentos = {};

    candidatos.forEach(candidato => {
        const departamento = String(
            candidato.departamento || ""
        ).trim();

        const salario = obterSalario(candidato);

        if (
            !departamento ||
            salario === null
        ) {
            return;
        }

        if (!departamentos[departamento]) {
            departamentos[departamento] = {
                soma: 0,
                quantidade: 0
            };
        }

        departamentos[departamento].soma += salario;
        departamentos[departamento].quantidade++;
    });

    return Object
        .entries(departamentos)
        .map(([departamento, dados]) => {
            return [
                departamento,
                dados.soma / dados.quantidade
            ];
        })
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);
}

function destruirGraficos() {
    const graficos = [
        graficoStatus,
        graficoDepartamentos,
        graficoCargos,
        graficoCidades,
        graficoSalarios
    ];

    graficos.forEach(grafico => {
        if (grafico) {
            grafico.destroy();
        }
    });

    graficoStatus = null;
    graficoDepartamentos = null;
    graficoCargos = null;
    graficoCidades = null;
    graficoSalarios = null;
}

function configuracaoTooltip() {
    return {
        backgroundColor: "#FFFFFF",
        titleColor: "#000000",
        bodyColor: "rgba(0, 0, 0, 0.65)",
        borderColor: "#E6E9E7",
        borderWidth: 1,
        padding: 11,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        titleFont: {
            family: "Montserrat",
            size: 11,
            weight: "600"
        },
        bodyFont: {
            family: "Poppins",
            size: 9
        }
    };
}

function configuracaoEscalaCategoria() {
    return {
        grid: {
            display: false
        },
        border: {
            display: false
        },
        ticks: {
            color: cores.texto,
            font: {
                family: "Poppins",
                size: 9
            }
        }
    };
}

function configuracaoEscalaNumerica() {
    return {
        beginAtZero: true,
        grid: {
            color: cores.grid,
            drawTicks: false
        },
        border: {
            display: false
        },
        ticks: {
            color: cores.texto,
            padding: 8,
            precision: 0,
            font: {
                family: "Poppins",
                size: 9
            }
        }
    };
}

function criarGraficoStatus(dados) {
    const contexto = document
        .getElementById("graficoStatus")
        .getContext("2d");

    graficoStatus = new Chart(
        contexto,
        {
            type: "doughnut",

            data: {
                labels: [
                    "Em análise",
                    "Aprovados",
                    "Reprovados",
                    "Contratados"
                ],

                datasets: [
                    {
                        data: dados,

                        backgroundColor: [
                            cores.azul,
                            cores.verdeEscuro,
                            cores.vermelho,
                            cores.verdeClaro
                        ],

                        borderColor: "#FFFFFF",
                        borderWidth: 4,
                        hoverOffset: 5
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",

                animation: {
                    duration: 700
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: configuracaoTooltip()
                }
            }
        }
    );
}

function criarGraficoHorizontal(
    elemento,
    labels,
    valores,
    cor
) {
    const contexto = document
        .getElementById(elemento)
        .getContext("2d");

    return new Chart(
        contexto,
        {
            type: "bar",

            data: {
                labels,

                datasets: [
                    {
                        data: valores,
                        backgroundColor: cor,
                        hoverBackgroundColor: cores.verdeClaro,
                        borderRadius: 7,
                        borderSkipped: false,
                        barThickness: 17
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",

                animation: {
                    duration: 700
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: configuracaoTooltip()
                },

                scales: {
                    y: configuracaoEscalaCategoria(),
                    x: configuracaoEscalaNumerica()
                }
            }
        }
    );
}

function criarGraficoCidades(labels, valores) {
    const contexto = document
        .getElementById("graficoCidades")
        .getContext("2d");

    graficoCidades = new Chart(
        contexto,
        {
            type: "bar",

            data: {
                labels,

                datasets: [
                    {
                        data: valores,
                        backgroundColor: "rgba(17, 199, 111, 0.82)",
                        hoverBackgroundColor: cores.verdeClaro,
                        borderRadius: 7,
                        borderSkipped: false,
                        maxBarThickness: 42
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 700
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: configuracaoTooltip()
                },

                scales: {
                    x: configuracaoEscalaCategoria(),
                    y: configuracaoEscalaNumerica()
                }
            }
        }
    );
}

function criarGraficoSalarios(labels, valores) {
    const contexto = document
        .getElementById("graficoSalarios")
        .getContext("2d");

    const gradiente = contexto.createLinearGradient(
        0,
        0,
        0,
        280
    );

    gradiente.addColorStop(
        0,
        "rgba(3, 98, 76, 0.95)"
    );

    gradiente.addColorStop(
        1,
        "rgba(17, 199, 111, 0.62)"
    );

    graficoSalarios = new Chart(
        contexto,
        {
            type: "bar",

            data: {
                labels,

                datasets: [
                    {
                        data: valores,
                        backgroundColor: gradiente,
                        hoverBackgroundColor: cores.verdeEscuro,
                        borderRadius: 7,
                        borderSkipped: false,
                        maxBarThickness: 44
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 700
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        ...configuracaoTooltip(),

                        callbacks: {
                            label(context) {
                                return formatarMoeda(
                                    context.raw
                                );
                            }
                        }
                    }
                },

                scales: {
                    x: configuracaoEscalaCategoria(),

                    y: {
                        ...configuracaoEscalaNumerica(),

                        ticks: {
                            ...configuracaoEscalaNumerica().ticks,

                            callback(valor) {
                                return Number(valor)
                                    .toLocaleString(
                                        "pt-BR",
                                        {
                                            notation: "compact"
                                        }
                                    );
                            }
                        }
                    }
                }
            }
        }
    );
}

function mostrarOuOcultarEstadoVazio(
    elemento,
    possuiDados
) {
    elemento.classList.toggle(
        "oculto",
        possuiDados
    );
}

function definirIndicadores(lista) {
    const candidatos = Array.isArray(lista)
        ? lista
        : [];

    destruirGraficos();

    const total = candidatos.length;

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

    totalCandidatosElemento.textContent =
        total
            ? formatarNumero(total)
            : "--";

    totalEmAnaliseElemento.textContent =
        total
            ? formatarNumero(emAnalise)
            : "--";

    totalAprovadosElemento.textContent =
        total
            ? formatarNumero(aprovados)
            : "--";

    totalReprovadosElemento.textContent =
        total
            ? formatarNumero(reprovados)
            : "--";

    totalContratadosElemento.textContent =
        total
            ? formatarNumero(contratados)
            : "--";

    totalCentro.textContent =
        total
            ? formatarNumero(total)
            : "--";

    legendaAnalise.textContent =
        total
            ? formatarNumero(emAnalise)
            : "--";

    legendaAprovados.textContent =
        total
            ? formatarNumero(aprovados)
            : "--";

    legendaReprovados.textContent =
        total
            ? formatarNumero(reprovados)
            : "--";

    legendaContratados.textContent =
        total
            ? formatarNumero(contratados)
            : "--";

    const departamentos = ordenarContagens(
        contarPorCampo(
            candidatos,
            "departamento"
        )
    );

    const cargos = ordenarContagens(
        contarPorCampo(
            candidatos,
            "cargo"
        )
    );

    const cidades = ordenarContagens(
        contarPorCampo(
            candidatos,
            "cidade"
        ),
        6
    );

    const mediasSalariais =
        calcularMediaSalarialPorDepartamento(
            candidatos
        );

    const salariosValidos = candidatos
        .map(obterSalario)
        .filter(salario => salario !== null);

    const mediaGeral = salariosValidos.length
        ? salariosValidos.reduce(
            (soma, salario) => soma + salario,
            0
        ) / salariosValidos.length
        : 0;

    const departamentosUnicos = new Set(
        candidatos
            .map(candidato =>
                String(
                    candidato.departamento || ""
                ).trim()
            )
            .filter(Boolean)
    ).size;

    const percentualAprovacao = total
        ? (aprovados / total) * 100
        : 0;

    const percentualContratacao = total
        ? (contratados / total) * 100
        : 0;

    taxaAprovacao.textContent =
        total
            ? formatarPercentual(
                percentualAprovacao
            )
            : "--";

    taxaContratacao.textContent =
        total
            ? formatarPercentual(
                percentualContratacao
            )
            : "--";

    salarioMedio.textContent =
        salariosValidos.length
            ? formatarMoeda(mediaGeral)
            : "--";

    quantidadeDepartamentos.textContent =
        total
            ? formatarNumero(
                departamentosUnicos
            )
            : "--";

    mostrarOuOcultarEstadoVazio(
        vazioStatus,
        total > 0
    );

    mostrarOuOcultarEstadoVazio(
        vazioDepartamentos,
        departamentos.length > 0
    );

    mostrarOuOcultarEstadoVazio(
        vazioCargos,
        cargos.length > 0
    );

    mostrarOuOcultarEstadoVazio(
        vazioCidades,
        cidades.length > 0
    );

    mostrarOuOcultarEstadoVazio(
        vazioSalarios,
        mediasSalariais.length > 0
    );

    if (total > 0) {
        criarGraficoStatus(
            [
                emAnalise,
                aprovados,
                reprovados,
                contratados
            ]
        );
    }

    if (departamentos.length > 0) {
        graficoDepartamentos =
            criarGraficoHorizontal(
                "graficoDepartamentos",
                departamentos.map(
                    item => item[0]
                ),
                departamentos.map(
                    item => item[1]
                ),
                "rgba(3, 98, 76, 0.88)"
            );
    }

    if (cargos.length > 0) {
        graficoCargos =
            criarGraficoHorizontal(
                "graficoCargos",
                cargos.map(
                    item => item[0]
                ),
                cargos.map(
                    item => item[1]
                ),
                "rgba(17, 199, 111, 0.82)"
            );
    }

    if (cidades.length > 0) {
        criarGraficoCidades(
            cidades.map(
                item => item[0]
            ),
            cidades.map(
                item => item[1]
            )
        );
    }

    if (mediasSalariais.length > 0) {
        criarGraficoSalarios(
            mediasSalariais.map(
                item => item[0]
            ),
            mediasSalariais.map(
                item => item[1]
            )
        );
    }
}

window.definirIndicadores = definirIndicadores;

window.definirUsuario = usuario => {
    if (!usuario) {
        return;
    }

    const nome =
        usuario.nome ||
        "Fulano";

    document.getElementById(
        "nomeUsuario"
    ).textContent = nome;

    document.getElementById(
        "nomePerfil"
    ).textContent = nome;

    document.getElementById(
        "nomePerfilDropdown"
    ).textContent = nome;

    if (usuario.email) {
        document.getElementById(
            "emailPerfilDropdown"
        ).textContent =
            usuario.email;
    }

    if (usuario.cargo) {
        document.getElementById(
            "cargoPerfilTopo"
        ).textContent =
            usuario.cargo;

        document.getElementById(
            "cargoPerfilDropdown"
        ).textContent =
            usuario.cargo;
    }
};

atualizarSaudacao();

definirIndicadores([]);
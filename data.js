/**
 * Dados do Fluxograma - Engenharia de Computação com Inteligência Artificial Aplicada
 * FEELT / UFU — PPC 2026-1
 *
 * Estrutura de cada disciplina:
 *   id        : número único (string, ex: "01")
 *   nome      : nome completo
 *   periodo   : período (1–8, ou "multi" para optativas/extensão)
 *   cht       : carga horária teórica
 *   chp       : carga horária prática
 *   chd       : carga horária a distância
 *   che       : carga horária de extensão
 *   total     : carga horária total
 *   prereqs   : IDs das disciplinas que são pré-requisito (▼)
 *   coreqs    : IDs das disciplinas que são correquisito (⋆)
 *   area      : categoria temática para filtro visual
 */

const AREAS = {
  MATEMATICA:   "Matemática",
  FISICA:       "Física",
  COMPUTACAO:   "Computação",
  HARDWARE:     "Hardware",
  IA:           "Inteligência Artificial",
  REDES:        "Redes e Comunicações",
  SOFTWARE:     "Engenharia de Software",
  EXTENSAO:     "Extensão",
  OPTATIVA:     "Optativa",
  GESTAO:       "Gestão e Negócios",
};

const disciplinas = [
  // ─── 1º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "01",
    nome: "Cálculo Diferencial e Integral I",
    periodo: 1,
    cht: 90, chp: 0, chd: 0, che: 0, total: 90,
    prereqs: [],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "02",
    nome: "Geometria Analítica",
    periodo: 1,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: [],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "03",
    nome: "Introdução à Engenharia de Computação",
    periodo: 1,
    cht: 30, chp: 0, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "04",
    nome: "Introdução à Prototipagem Eletrônica",
    periodo: 1,
    cht: 0, chp: 30, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "05",
    nome: "Lógica e Matemática Discreta",
    periodo: 1,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: [],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "06",
    nome: "Programação Script",
    periodo: 1,
    cht: 30, chp: 30, chd: 0, che: 0, total: 60,
    prereqs: [],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },

  // ─── 2º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "07",
    nome: "Álgebra Linear",
    periodo: 2,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: [],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "08",
    nome: "Cálculo Diferencial e Integral II",
    periodo: 2,
    cht: 90, chp: 0, chd: 0, che: 0, total: 90,
    prereqs: ["01"],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "09",
    nome: "Física Básica: Mecânica",
    periodo: 2,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["01"],
    coreqs: ["10"],
    area: AREAS.FISICA,
  },
  {
    id: "10",
    nome: "Experimental de Física Básica: Mecânica",
    periodo: 2,
    cht: 0, chp: 30, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: ["09"],   // correquisito de Física Básica: Mecânica
    area: AREAS.FISICA,
  },
  {
    id: "11",
    nome: "Metrologia",
    periodo: 2,
    cht: 30, chp: 30, chd: 0, che: 0, total: 60,
    prereqs: [],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "12",
    nome: "Programação Procedimental",
    periodo: 2,
    cht: 30, chp: 30, chd: 0, che: 0, total: 60,
    prereqs: ["06"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "13",
    nome: "Sistemas Digitais",
    periodo: 2,
    cht: 30, chp: 0, chd: 0, che: 0, total: 30,
    prereqs: ["05"],
    coreqs: ["14"],
    area: AREAS.HARDWARE,
  },
  {
    id: "14",
    nome: "Experimental de Sistemas Digitais",
    periodo: 2,
    cht: 0, chp: 30, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: ["13"],   // correquisito de Sistemas Digitais
    area: AREAS.HARDWARE,
  },

  // ─── 3º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "15",
    nome: "Cálculo Diferencial e Integral III",
    periodo: 3,
    cht: 90, chp: 0, chd: 0, che: 0, total: 90,
    prereqs: ["08"],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "16",
    nome: "Física Básica: Eletricidade e Magnetismo",
    periodo: 3,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["09"],
    coreqs: ["17"],
    area: AREAS.FISICA,
  },
  {
    id: "17",
    nome: "Experimental de Física Básica: Eletricidade e Magnetismo",
    periodo: 3,
    cht: 0, chp: 30, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: ["16"],
    area: AREAS.FISICA,
  },
  {
    id: "18",
    nome: "Elementos de Sistemas Computacionais",
    periodo: 3,
    cht: 30, chp: 0, chd: 30, che: 0, total: 60,
    prereqs: ["13"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "19",
    nome: "Estrutura de Dados",
    periodo: 3,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["12"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "20",
    nome: "Inteligência Artificial, Ética e Sociedade",
    periodo: 3,
    cht: 30, chp: 0, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "21",
    nome: "Programação Funcional",
    periodo: 3,
    cht: 30, chp: 15, chd: 0, che: 0, total: 45,
    prereqs: ["12"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "22",
    nome: "Programação Orientada a Objetos",
    periodo: 3,
    cht: 30, chp: 30, chd: 0, che: 0, total: 60,
    prereqs: ["12"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },

  // ─── 4º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "23",
    nome: "Estatística",
    periodo: 4,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["15"],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "24",
    nome: "Métodos Matemáticos",
    periodo: 4,
    cht: 75, chp: 0, chd: 0, che: 0, total: 75,
    prereqs: ["15"],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "25",
    nome: "Análise de Algoritmos",
    periodo: 4,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["19"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "26",
    nome: "Arquitetura e Organização de Computadores",
    periodo: 4,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["18"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "27",
    nome: "Banco de Dados",
    periodo: 4,
    cht: 15, chp: 45, chd: 0, che: 0, total: 60,
    prereqs: ["19"],
    coreqs: [],
    area: AREAS.SOFTWARE,
  },
  {
    id: "28",
    nome: "Circuitos Eletro-Elétricos I",
    periodo: 4,
    cht: 75, chp: 0, chd: 0, che: 0, total: 75,
    prereqs: ["16"],
    coreqs: ["29"],
    area: AREAS.HARDWARE,
  },
  {
    id: "29",
    nome: "Experimental de Circuitos Eletro-Elétricos I",
    periodo: 4,
    cht: 0, chp: 15, chd: 0, che: 0, total: 15,
    prereqs: ["11"],
    coreqs: ["28"],
    area: AREAS.HARDWARE,
  },
  {
    id: "30",
    nome: "Atividades Curriculares de Extensão I",
    periodo: 4,
    cht: 0, chp: 0, chd: 0, che: 90, total: 90,
    prereqs: [],
    coreqs: [],
    area: AREAS.EXTENSAO,
  },

  // ─── 5º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "31",
    nome: "Cálculo Numérico",
    periodo: 5,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["07", "15"],
    coreqs: [],
    area: AREAS.MATEMATICA,
  },
  {
    id: "32",
    nome: "Empreendedorismo e Inovação",
    periodo: 5,
    cht: 30, chp: 0, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: [],
    area: AREAS.GESTAO,
  },
  {
    id: "33",
    nome: "Eletrônica Analógica I",
    periodo: 5,
    cht: 60, chp: 0, chd: 0, che: 0, total: 60,
    prereqs: ["28"],
    coreqs: ["34"],
    area: AREAS.HARDWARE,
  },
  {
    id: "34",
    nome: "Experimental de Eletrônica Analógica I",
    periodo: 5,
    cht: 0, chp: 30, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: ["33"],
    area: AREAS.HARDWARE,
  },
  {
    id: "35",
    nome: "Engenharia de Software",
    periodo: 5,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: ["22", "27"],
    coreqs: [],
    area: AREAS.SOFTWARE,
  },
  {
    id: "36",
    nome: "Fundamentos da Inteligência Artificial",
    periodo: 5,
    cht: 30, chp: 15, chd: 0, che: 0, total: 45,
    prereqs: ["23"],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "37",
    nome: "Sistemas Operacionais",
    periodo: 5,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: ["12", "26"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "38",
    nome: "Atividades Curriculares de Extensão II",
    periodo: 5,
    cht: 0, chp: 0, chd: 0, che: 90, total: 90,
    prereqs: ["30"],
    coreqs: [],
    area: AREAS.EXTENSAO,
  },

  // ─── 6º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "39",
    nome: "Aprendizagem de Máquina",
    periodo: 6,
    cht: 30, chp: 15, chd: 0, che: 0, total: 45,
    prereqs: ["07", "15", "36"],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "40",
    nome: "Processamento Digital de Sinais",
    periodo: 6,
    cht: 45, chp: 15, chd: 0, che: 0, total: 60,
    prereqs: ["24"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "41",
    nome: "Redes de Comunicações I",
    periodo: 6,
    cht: 45, chp: 15, chd: 0, che: 0, total: 60,
    prereqs: ["37"],
    coreqs: [],
    area: AREAS.REDES,
  },
  {
    id: "42",
    nome: "Sistemas Embarcados I",
    periodo: 6,
    cht: 45, chp: 30, chd: 0, che: 0, total: 75,
    prereqs: ["26", "33", "37"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "43",
    nome: "Teoria da Computação",
    periodo: 6,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: ["25"],
    coreqs: [],
    area: AREAS.COMPUTACAO,
  },
  {
    id: "44",
    nome: "Atividades Curriculares de Extensão III",
    periodo: 6,
    cht: 0, chp: 0, chd: 0, che: 75, total: 75,
    prereqs: ["38"],
    coreqs: [],
    area: AREAS.EXTENSAO,
  },

  // ─── 7º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "45",
    nome: "Aprendizagem Profunda e Modelos Generativos",
    periodo: 7,
    cht: 30, chp: 15, chd: 0, che: 0, total: 45,
    prereqs: ["31", "36"],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "46",
    nome: "Redes de Comunicações II",
    periodo: 7,
    cht: 45, chp: 15, chd: 0, che: 0, total: 60,
    prereqs: ["41"],
    coreqs: [],
    area: AREAS.REDES,
  },
  {
    id: "47",
    nome: "Segurança de Sistemas Computacionais",
    periodo: 7,
    cht: 15, chp: 0, chd: 30, che: 0, total: 45,
    prereqs: ["41"],
    coreqs: [],
    area: AREAS.REDES,
  },
  {
    id: "48",
    nome: "Sistemas Computacionais em Tempo Real",
    periodo: 7,
    cht: 15, chp: 30, chd: 0, che: 0, total: 45,
    prereqs: ["42"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "49",
    nome: "Sistemas e Controle",
    periodo: 7,
    cht: 30, chp: 15, chd: 0, che: 0, total: 45,
    prereqs: ["40"],
    coreqs: [],
    area: AREAS.HARDWARE,
  },
  {
    id: "50",
    nome: "Atividades Curriculares de Extensão IV",
    periodo: 7,
    cht: 0, chp: 0, chd: 0, che: 60, total: 60,
    prereqs: ["44"],
    coreqs: [],
    area: AREAS.EXTENSAO,
  },

  // ─── 8º PERÍODO ────────────────────────────────────────────────────────────
  {
    id: "51",
    nome: "Engenharia Econômica",
    periodo: 8,
    cht: 30, chp: 0, chd: 0, che: 0, total: 30,
    prereqs: [],
    coreqs: [],
    area: AREAS.GESTAO,
  },
  {
    id: "52",
    nome: "Arquitetura de Software Aplicada",
    periodo: 8,
    cht: 15, chp: 45, chd: 0, che: 0, total: 60,
    prereqs: ["35", "41"],
    coreqs: [],
    area: AREAS.SOFTWARE,
  },
  {
    id: "53",
    nome: "Engenharia de Contexto em IA Generativa",
    periodo: 8,
    cht: 15, chp: 0, chd: 30, che: 0, total: 45,
    prereqs: ["45"],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "54",
    nome: "IA Aplicada à Cibersegurança",
    periodo: 8,
    cht: 15, chp: 0, chd: 30, che: 0, total: 45,
    prereqs: ["45", "47"],
    coreqs: [],
    area: AREAS.IA,
  },
  {
    id: "55",
    nome: "Sistemas Distribuídos",
    periodo: 8,
    cht: 45, chp: 0, chd: 0, che: 0, total: 45,
    prereqs: ["41"],
    coreqs: [],
    area: AREAS.REDES,
  },
  {
    id: "56",
    nome: "Memorial de Atividades Curriculares de Extensão",
    periodo: 8,
    cht: 0, chp: 0, chd: 0, che: 30, total: 30,
    prereqs: ["50"],
    coreqs: [],
    area: AREAS.EXTENSAO,
  },

  // ─── MULTI-PERÍODO ─────────────────────────────────────────────────────────
  {
    id: "57",
    nome: "Disciplinas Optativas",
    periodo: "multi",
    cht: 0, chp: 0, chd: 0, che: 0, total: 90,
    prereqs: [],
    coreqs: [],
    area: AREAS.OPTATIVA,
    obs: "Carga horária e conteúdo definidos conforme componente curricular escolhido.",
  },
  {
    id: "58",
    nome: "Atividades Acadêmicas Complementares",
    periodo: "multi",
    cht: 0, chp: 0, chd: 0, che: 0, total: 90,
    prereqs: [],
    coreqs: [],
    area: AREAS.EXTENSAO,
    obs: "Carga horária definida conforme componente curricular escolhido.",
  },
  {
    id: "59",
    nome: "Atividade de Conclusão de Curso",
    periodo: "multi",
    cht: 0, chp: 0, chd: 0, che: 0, total: 300,
    prereqs: [],
    coreqs: [],
    area: AREAS.COMPUTACAO,
    obs: "Carga horária definida conforme componente curricular escolhido.",
  },
];

// ─── TOTAIS DO CURSO (para o painel de horas) ──────────────────────────────
const CURSO = {
  nome: "Engenharia de Computação com Inteligência Artificial Aplicada",
  sigla: "ECP-IA",
  unidade: "FEELT / UFU",
  ppc: "2026-1",
  chObrigatorias: 1875,   // CH obrigatórias (excl. extensão)
  chExtensao: 345,        // CH de extensão obrigatória
  chOptativas: 90,        // CH optativas
  chComplementares: 90,   // Atividades acadêmicas complementares
  chTCC: 300,             // TCC / Atividade de conclusão
  chTotal: 3450,          // CH total do curso
};

// ─── HELPERS ───────────────────────────────────────────────────────────────

/** Mapa id → disciplina para acesso O(1) */
const disciplinaMap = Object.fromEntries(disciplinas.map(d => [d.id, d]));

/**
 * Dado um conjunto de IDs cursados, retorna quais disciplinas estão:
 *   - "concluida"  : id está em cursadas
 *   - "disponivel" : todos os prereqs estão em cursadas (e não foi cursada ainda)
 *   - "bloqueada"  : algum prereq faltando
 */
function calcularStatus(cursadas = new Set()) {
	const status = {};

	// passo 1: inicializa com base apenas nos pre-requisitos
	for (const d of disciplinas) {
		if (cursadas.has(d.id)) {
			status[d.id] = "concluida";
		} else {
			const prereqsOk = d.prereqs.every(p => cursadas.has(p));
			status[d.id] = prereqsOk ? "disponivel" : "bloqueada";
		}
	}

	// passo 2: valida os co-requisitos de forma iterativa
	let mudou = true;
	while (mudou) {
		mudou = false;
		for (const d of disciplinas) {
			if (status[d.id] === "disponivel") {
				const coreqs = d.coreqs || [];
				// a disciplina so continua disponivel se todos os co-requisitos dela
				// tambem estiverem disponiveis ou ja concluidos
				const coreqsOk = coreqs.every(c => status[c] === "disponivel" || status[c] === "concluida");
				
				if (!coreqsOk) {
					status[d.id] = "bloqueada";
					mudou = true; // roda de novo para propagar o bloqueio se necessario
				}
			}
		}
	}

	return status;
}

/**
 * Retorna os IDs das disciplinas que têm `id` como pré-requisito direto.
 * (usado para destacar dependentes ao hover)
 */
function getDependentes(id) {
  return disciplinas
    .filter(d => d.prereqs.includes(id))
    .map(d => d.id);
}

/**
 * Soma a CH total das disciplinas cujos IDs estão em `cursadas`.
 * Exclui disciplinas de extensão e optativas (che puro / periodo multi).
 */
function calcularCHCursada(cursadas = new Set()) {
  return [...cursadas].reduce((acc, id) => {
    const d = disciplinaMap[id];
    if (!d || d.periodo === "multi") return acc;
    return acc + d.cht + d.chp + d.chd;
  }, 0);
}

/**
 * Soma a CH de extensão das disciplinas de extensão cursadas.
 */
function calcularCHExtensaoCursada(cursadas = new Set()) {
  return [...cursadas].reduce((acc, id) => {
    const d = disciplinaMap[id];
    return acc + (d?.che ?? 0);
  }, 0);
}

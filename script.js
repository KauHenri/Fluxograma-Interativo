/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
// ponte para o data.js
const dMap = disciplinaMap;

const AREA_DOT = {
  [AREAS.MATEMATICA]: "dot-mat", [AREAS.FISICA]: "dot-fis",
  [AREAS.COMPUTACAO]: "dot-com", [AREAS.HARDWARE]: "dot-hw",
  [AREAS.IA]: "dot-ia", [AREAS.REDES]: "dot-red",
  [AREAS.SOFTWARE]: "dot-sof", [AREAS.EXTENSAO]: "dot-ext",
  [AREAS.OPTATIVA]: "dot-opt", [AREAS.GESTAO]: "dot-ges",
};

/* ═══════════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

const cursadas = new Set();
const planejadas = new Set();
let activeFilter = "all";

function loadState() {
  try {
    const raw = localStorage.getItem("ecp_cursadas");
    if (raw) JSON.parse(raw).forEach(id => cursadas.add(id));
    const raw2 = localStorage.getItem("ecp_planejadas");
    if (raw2) JSON.parse(raw2).forEach(id => planejadas.add(id));
  } catch { }
}

function saveState() {
  localStorage.setItem("ecp_cursadas", JSON.stringify([...cursadas]));
  localStorage.setItem("ecp_planejadas", JSON.stringify([...planejadas]));
}

function getStatus(id) {
  if (cursadas.has(id)) return "concluida";
  if (planejadas.has(id)) return "planejada";
  const d = dMap[id];
  if (!d) return "bloqueada";
  return isDisciplinaDisponivel(d) ? "disponivel" : "bloqueada";
}

function prereqsOk(d, ignoredId = null) {
  return d.prereqs.every(p => p === ignoredId || cursadas.has(p));
}

function isDisciplinaDisponivel(d) {
  if (!prereqsOk(d)) return false;
  return d.coreqs.every(cid => {
    const coreq = dMap[cid];
    return !coreq || cursadas.has(cid) || prereqsOk(coreq, d.id);
  });
}

function getPendencias(d) {
  const items = d.prereqs
    .filter(pid => !cursadas.has(pid))
    .map(pid => dMap[pid]?.nome || pid);

  d.coreqs.forEach(cid => {
    const coreq = dMap[cid];
    if (!coreq || cursadas.has(cid) || prereqsOk(coreq, d.id)) return;
    const missing = coreq.prereqs
      .filter(pid => pid !== d.id && !cursadas.has(pid))
      .map(pid => dMap[pid]?.nome || pid);
    items.push(`${coreq.nome}: ${missing.join(", ")}`);
  });

  return items;
}

function getDependentes(id) {
  return disciplinas.filter(d => d.prereqs.includes(id)).map(d => d.id);
}

function isExtensaoCurricular(d) {
  return d.che > 0;
}

/* ═══════════════════════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════════════════════ */
const grid = document.getElementById("grid");

function buildGrid() {
  grid.innerHTML = "";
  const periodGrid = document.createElement("div");
  periodGrid.className = "period-grid";
  const periodos = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const p of periodos) {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `<div class="col-header">${p}º Período</div>`;
    const discs = disciplinas.filter(d => d.periodo === p && !isExtensaoCurricular(d));
    for (const d of discs) col.appendChild(makeCard(d));
    periodGrid.appendChild(col);
  }
  // Multi
  const colM = document.createElement("div");
  colM.className = "col col-multi";
  colM.innerHTML = `<div class="col-header">Multi-período</div>`;
  disciplinas.filter(d => d.periodo === "multi").forEach(d => colM.appendChild(makeCard(d)));
  periodGrid.appendChild(colM);
  grid.appendChild(periodGrid);

  const extensionBand = document.createElement("div");
  extensionBand.className = "extension-band";
  extensionBand.innerHTML = `<div class="col-header">Atividades Curriculares de Extensão</div>`;
  const extensionCards = document.createElement("div");
  extensionCards.className = "extension-cards";
  disciplinas.filter(isExtensaoCurricular).forEach(d => extensionCards.appendChild(makeCard(d)));
  extensionBand.appendChild(extensionCards);
  grid.appendChild(extensionBand);
}

function makeCard(d) {
  const el = document.createElement("div");
  el.className = "card";
  el.dataset.id = d.id;
  el.dataset.area = d.area;

  const depCount = getDependentes(d.id).length;

  el.innerHTML = `
    <span class="card-area-dot ${AREA_DOT[d.area] || ''}"></span>
    <div class="card-name">${d.nome}</div>
    <div class="card-meta">
      <span class="card-ch">${d.total}h</span>
      <div class="card-badges">
        ${d.coreqs.length ? `<span class="badge-coreq" title="Tem correquisito">⋆</span>` : ""}
        ${depCount > 0 ? `<span class="badge-dep">+${depCount}</span>` : ""}
        <span class="badge-check" style="display:none">
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="2,5 4,7 8,3"/>
          </svg>
        </span>
      </div>
    </div>
    ${d.prereqs.length === 0 && d.periodo !== "multi" ? '' :
      `<div class="card-lock">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>`
    }
  `;

  if (!isTouchDevice) {
    // ── Desktop: mouse events ──────────────────────────────────
    el.addEventListener("click", () => modoSim ? toggleSim(d.id) : onCardClick(d.id));
    el.addEventListener("contextmenu", e => { e.preventDefault(); onCardRightClick(d.id); });
    el.addEventListener("mouseenter", e => onCardHover(d.id, e));
    el.addEventListener("mouseleave", () => onCardLeave(d.id));
    el.addEventListener("mousemove", e => moveTooltip(e));
  } else {
    // ── Mobile: touch events ───────────────────────────────────
    let tapTimer = null;
    let tapCount = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let longPressTimer = null;
    let isLongPress = false;
    const SCROLL_THRESHOLD = 10;

    // Evitar menu de contexto padrão no mobile ao segurar
    el.addEventListener("contextmenu", e => e.preventDefault());

    el.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isLongPress = false;

      longPressTimer = setTimeout(() => {
        isLongPress = true;
        onCardHover(d.id, null, true);
      }, 400); // 400ms para ativar o destaque
    }, { passive: true });

    el.addEventListener("touchmove", (e) => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
        clearTimeout(longPressTimer);
        // Se já ativou o long press, mantém fixo mesmo rolando a tela
      }
    }, { passive: true });

    el.addEventListener("touchend", (e) => {
      clearTimeout(longPressTimer);

      if (isLongPress) {
        // Mantém o destaque ativo, apenas previne o click padrão
        e.preventDefault();
        return;
      }

      if (el.classList.contains('dimmed')) {
        // Bloqueia a interação se o card estiver desfocado pelo destaque
        e.preventDefault();
        return;
      }

      const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);

      if (dx > SCROLL_THRESHOLD || dy > SCROLL_THRESHOLD) {
        tapCount = 0;
        clearTimeout(tapTimer);
        return;
      }

      e.preventDefault();
      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(() => {
          tapCount = 0;
          modoSim ? toggleSim(d.id) : onCardClick(d.id);
        }, 300);
      } else if (tapCount >= 2) {
        clearTimeout(tapTimer);
        tapCount = 0;
        openSheet(d.id);
      }
    }, { passive: false });

    el.addEventListener("touchcancel", () => {
      clearTimeout(longPressTimer);
      // Mantém fixo se estava em long press
    });
  }

  return el;
}

function updateCard(id) {
  const el = document.querySelector(`.card[data-id="${id}"]`);
  if (!el) return;
  const st = getStatus(id);
  el.dataset.status = st;

  const check = el.querySelector(".badge-check");
  const lock = el.querySelector(".card-lock");
  if (check) check.style.display = st === "concluida" ? "flex" : "none";
  if (lock) lock.style.display = st === "bloqueada" ? "block" : "none";
}

function updateAll() {
  disciplinas.forEach(d => updateCard(d.id));
  updateProgress();
  applyFilter(activeFilter);
}

function updateProgress() {
  const total = disciplinas.filter(d => d.periodo !== "multi").length;
  const done = [...cursadas].filter(id => dMap[id]?.periodo !== "multi").length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;
  document.getElementById("prog-label").textContent = `${done} / ${total}`;
  document.getElementById("prog-fill").style.width = pct + "%";
  document.getElementById("prog-pct").textContent = pct + "%";
}

/* ═══════════════════════════════════════════════════════════════
   INTERACTIONS
═══════════════════════════════════════════════════════════════ */
function onCardClick(id) {
  const st = getStatus(id);
  if (st === "bloqueada") {
    const d = dMap[id];
    const missing = getPendencias(d);
    const detail = missing.length ? `\n\nPré-requisito pendente: ${missing.join(", ")}` : "";
    if (!confirm(`Marcar "${d.nome}" como concluída mesmo sem os pré-requisitos?${detail}`)) return;
    showToast("Marcada como concluída por equivalência/grade anterior");
  }
  if (st === "concluida") {
    cursadas.delete(id);
    planejadas.delete(id);
  } else {
    cursadas.add(id);
    planejadas.delete(id);
  }
  saveState();
  updateAll();
}

function onCardRightClick(id) {
  const st = getStatus(id);
  if (st === "concluida") return;
  if (planejadas.has(id)) {
    planejadas.delete(id);
    showToast("Removido de cursando");
  } else {
    if (st === "bloqueada") {
      const d = dMap[id];
      const missing = getPendencias(d);
      const detail = missing.length ? `\n\nPré-requisito pendente: ${missing.join(", ")}` : "";
      if (!confirm(`Marcar "${d.nome}" como cursando mesmo sem os pré-requisitos?${detail}`)) return;
      showToast("Marcada como cursando por equivalência/grade anterior");
    } else {
      showToast("Marcado como cursando");
    }
    planejadas.add(id);
  }
  saveState();
  updateAll();
}

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
let hoverTimer = null;

function onCardHover(id, e, force = false) {
  if (isTouchDevice && !force) return; // hover desativado no mobile, exceto via long press
  // Debounce: só ativa highlight/tooltip após 200ms parado no card
  hoverTimer = setTimeout(() => {
    const deps = getDependentes(id);
    document.querySelectorAll(".card").forEach(el => {
      const eid = el.dataset.id;
      if (eid === id) return;
      if (deps.includes(eid) || (dMap[eid]?.prereqs || []).includes(id)) {
        el.classList.add("destaque");
        el.classList.remove("dimmed");
      } else {
        el.classList.add("dimmed");
        el.classList.remove("destaque");
      }
    });
    if (e) showTooltip(id, e);
  }, force ? 0 : 1000);
}

function onCardLeave(id) {
  // Cancela o debounce e remove tudo imediatamente
  clearTimeout(hoverTimer);
  hoverTimer = null;
  document.querySelectorAll(".card").forEach(el => {
    el.classList.remove("destaque", "dimmed");
  });
  hideTooltip();
}

/* ═══════════════════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════════════════ */
const tooltip = document.getElementById("tooltip");

function showTooltip(id, e) {
  if (isTouchDevice) return;
  const d = dMap[id];
  const st = getStatus(id);
  const deps = getDependentes(id);

  let prereqsHtml = "";
  if (d.prereqs.length) {
    const items = d.prereqs.map(pid => {
      const ok = cursadas.has(pid);
      return `<div class="tt-prereq-item ${ok ? 'ok' : 'missing'}">${ok ? "✓" : "✗"} ${dMap[pid]?.nome || pid}</div>`;
    }).join("");
    prereqsHtml = `<div class="tt-prereqs"><strong>Pré-requisitos</strong>${items}</div>`;
  }

  let coreqsHtml = "";
  if (d.coreqs.length) {
    const items = d.coreqs.map(cid => `<div class="tt-prereq-item">⋆ ${dMap[cid]?.nome || cid}</div>`).join("");
    coreqsHtml = `<div class="tt-coreqs"><strong>Correquisitos</strong>${items}</div>`;
  }

  let depsHtml = "";
  if (deps.length) {
    depsHtml = `<div class="tt-prereqs"><strong>Libera (${deps.length})</strong>${deps.map(did => `<div class="tt-prereq-item">${dMap[did]?.nome || did}</div>`).join("")}</div>`;
  }

  const statusLabel = { concluida: "Concluída", disponivel: "Disponível", bloqueada: "Bloqueada", planejada: "Cursando" }[st] || st;

  tooltip.innerHTML = `
    <div class="tt-name">${d.nome}</div>
    <div class="tt-area">${d.area} · ${statusLabel}</div>
    <div class="tt-divider"></div>
    <div class="tt-row"><span>Total</span><span>${d.total}h</span></div>
    <div class="tt-row"><span>Teórica</span><span>${d.cht}h</span></div>
    <div class="tt-row"><span>Prática</span><span>${d.chp}h</span></div>
    ${d.chd ? `<div class="tt-row"><span>EaD</span><span>${d.chd}h</span></div>` : ""}
    ${d.che ? `<div class="tt-row"><span>Extensão</span><span>${d.che}h</span></div>` : ""}
    ${prereqsHtml}${coreqsHtml}${depsHtml}
    <div class="tt-hint">${st === "disponivel" ? "clique para marcar · botão direito para cursando" : st === "concluida" ? "clique para desmarcar" : st === "planejada" ? "clique para concluir · dir. para remover cursando" : st === "bloqueada" ? "clique para marcar mesmo sem pré-requisito" : ""}</div>
  `;

  tooltip.classList.add("visible");
  moveTooltip(e);
}

function moveTooltip(e) {
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let x = e.clientX - tw - 14;
  let y = e.clientY + 14;
  if (x < 8) x = e.clientX + 14;
  if (y + th > window.innerHeight - 8) y = e.clientY - th - 14;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

/* ═══════════════════════════════════════════════════════════════
   FILTER
═══════════════════════════════════════════════════════════════ */
function applyFilter(area) {
  activeFilter = area;
  document.querySelectorAll(".card").forEach(el => {
    if (area === "all" || el.dataset.area === area) {
      el.classList.remove("dimmed");
    } else {
      el.classList.add("dimmed");
    }
  });
  document.querySelectorAll(".chip").forEach(c => {
    c.classList.toggle("active", c.dataset.filter === area);
  });
}

document.querySelectorAll(".chip").forEach(c => {
  c.addEventListener("click", () => applyFilter(c.dataset.filter));
});

/* ═══════════════════════════════════════════════════════════════
   HORAS PANEL
═══════════════════════════════════════════════════════════════ */
const panelOverlay = document.getElementById("panel-overlay");
const panelRows = document.getElementById("panel-rows");

function calcCH() {
  let obrig = 0, ext = 0;
  for (const id of cursadas) {
    const d = dMap[id];
    if (!d || d.periodo === "multi") continue;
    obrig += d.cht + d.chp + d.chd;
    ext += d.che;
  }
  return { obrig, ext };
}

function openPanel() {
  const { obrig, ext } = calcCH();
  const rows = [
    { label: "Obrigatórias", done: obrig, total: CURSO.chObrigatorias },
    { label: "Extensão", done: ext, total: CURSO.chExtensao },
    { label: "Optativas (manual)", done: 0, total: CURSO.chOptativas },
    { label: "Ativ. Complementar", done: 0, total: CURSO.chComplementares },
    { label: "TCC", done: 0, total: CURSO.chTCC },
  ];
  panelRows.innerHTML = rows.map(r => {
    const pct = Math.min(100, Math.round(r.done / r.total * 100));
    return `
      <div class="panel-row">
        <span class="panel-row-label">${r.label}</span>
        <div class="panel-row-bar"><div class="panel-row-fill" style="width:${pct}%"></div></div>
        <span class="panel-row-nums"><em>${r.done}</em> / ${r.total}h</span>
      </div>
    `;
  }).join("") + `
    <div class="panel-row" style="margin-top:8px;border-top:1px solid #2a3148;padding-top:14px;">
      <span class="panel-row-label" style="font-weight:600;color:#e2e8f0">Total estimado</span>
      <div class="panel-row-bar"><div class="panel-row-fill" style="width:${Math.round((obrig + ext) / CURSO.chTotal * 100)}%"></div></div>
      <span class="panel-row-nums"><em>${obrig + ext}</em> / ${CURSO.chTotal}h</span>
    </div>
  `;
  panelOverlay.classList.add("open");
}

document.getElementById("panel-close").addEventListener("click", () => panelOverlay.classList.remove("open"));
panelOverlay.addEventListener("click", e => { if (e.target === panelOverlay) panelOverlay.classList.remove("open"); });

/* ═══════════════════════════════════════════════════════════════
   MANUAL
═══════════════════════════════════════════════════════════════ */
const manualOverlay = document.getElementById("manual-overlay");

function openManual(markSeen = false) {
  manualOverlay.classList.add("open");
  if (markSeen) localStorage.setItem("ecp_manual_seen", "1");
}

function closeManual() {
  manualOverlay.classList.remove("open");
  localStorage.setItem("ecp_manual_seen", "1");
}

document.getElementById("manual-close").addEventListener("click", closeManual);
manualOverlay.addEventListener("click", e => { if (e.target === manualOverlay) closeManual(); });

/* ═══════════════════════════════════════════════════════════════
   SHARE
═══════════════════════════════════════════════════════════════ */
function doShare() {
  const ids = [...cursadas].join(",");
  const url = location.origin + location.pathname + "?c=" + encodeURIComponent(ids);
  navigator.clipboard.writeText(url).then(() => showToast("Link copiado!")).catch(() => {
    prompt("Copie o link:", url);
  });
}

function loadFromURL() {
  const params = new URLSearchParams(location.search);
  const c = params.get("c");
  if (c) c.split(",").filter(Boolean).forEach(id => { if (dMap[id]) cursadas.add(id); });
}

/* ═══════════════════════════════════════════════════════════════
   RESET
═══════════════════════════════════════════════════════════════ */
document.getElementById("btn-reset").addEventListener("click", () => {
  if (!confirm("Limpar todo o progresso?")) return;
  cursadas.clear(); planejadas.clear();
  saveState();
  updateAll();
  showToast("Progresso limpo");
});

/* ═══════════════════════════════════════════════════════════════
   BOTTOM SHEET (mobile)
═══════════════════════════════════════════════════════════════ */
const sheetOverlay = document.getElementById("sheet-overlay");
const bottomSheet = document.getElementById("bottom-sheet");
const sheetBody = document.getElementById("sheet-body");
const sheetActions = document.getElementById("sheet-actions");
let sheetCurrentId = null;

function openSheet(id) {
  sheetCurrentId = id;
  renderSheet(id);
  highlightForSheet(id);
  sheetOverlay.classList.add("open");
  bottomSheet.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  sheetOverlay.classList.remove("open");
  bottomSheet.classList.remove("open");
  document.body.style.overflow = "";
  document.querySelectorAll(".card").forEach(el => el.classList.remove("destaque", "dimmed"));
  sheetCurrentId = null;
}

function highlightForSheet(id) {
  const deps = getDependentes(id);
  document.querySelectorAll(".card").forEach(el => {
    const eid = el.dataset.id;
    if (eid === id) { el.classList.remove("dimmed", "destaque"); return; }
    if (deps.includes(eid) || (dMap[eid]?.prereqs || []).includes(id)) {
      el.classList.add("destaque"); el.classList.remove("dimmed");
    } else {
      el.classList.add("dimmed"); el.classList.remove("destaque");
    }
  });
}

function renderSheet(id) {
  const d = dMap[id];
  const st = getStatus(id);
  const statusLabel = { concluida: "Concluída", disponivel: "Disponível", bloqueada: "Bloqueada", planejada: "Cursando" }[st] || st;

  document.getElementById("sheet-name").textContent = d.nome;
  document.getElementById("sheet-area-text").textContent = d.area + " · ";
  const badge = document.getElementById("sheet-status-badge");
  badge.textContent = statusLabel;
  badge.className = "sheet-status-badge " + st;

  // Carga horária
  let chItems = `<div class="sheet-ch-item"><span class="sheet-ch-val">${d.total}h</span><span class="sheet-ch-lbl">Total</span></div>`;
  if (d.cht) chItems += `<div class="sheet-ch-item"><span class="sheet-ch-val">${d.cht}h</span><span class="sheet-ch-lbl">Teórica</span></div>`;
  if (d.chp) chItems += `<div class="sheet-ch-item"><span class="sheet-ch-val">${d.chp}h</span><span class="sheet-ch-lbl">Prática</span></div>`;
  if (d.chd) chItems += `<div class="sheet-ch-item"><span class="sheet-ch-val">${d.chd}h</span><span class="sheet-ch-lbl">EaD</span></div>`;
  if (d.che) chItems += `<div class="sheet-ch-item"><span class="sheet-ch-val">${d.che}h</span><span class="sheet-ch-lbl">Extensão</span></div>`;

  let bodyHtml = `<div><div class="sheet-section-title">Carga Horária</div><div class="sheet-ch-row">${chItems}</div></div>`;

  if (d.prereqs.length) {
    const items = d.prereqs.map(pid => {
      const ok = cursadas.has(pid);
      return `<div class="sheet-list-item ${ok ? 'ok' : 'missing'}"><span class="sheet-icon">${ok ? '✓' : '✗'}</span>${dMap[pid]?.nome || pid}</div>`;
    }).join("");
    bodyHtml += `<div><div class="sheet-section-title">Pré-requisitos</div>${items}</div>`;
  }
  if (d.coreqs.length) {
    const items = d.coreqs.map(cid => `<div class="sheet-list-item"><span class="sheet-icon">⋆</span>${dMap[cid]?.nome || cid}</div>`).join("");
    bodyHtml += `<div><div class="sheet-section-title">Correquisitos</div>${items}</div>`;
  }
  const deps = getDependentes(id);
  if (deps.length) {
    const items = deps.map(did => `<div class="sheet-list-item"><span class="sheet-icon">→</span>${dMap[did]?.nome || did}</div>`).join("");
    bodyHtml += `<div><div class="sheet-section-title">Libera (${deps.length})</div>${items}</div>`;
  }
  sheetBody.innerHTML = bodyHtml;

  // Botões de ação
  let actionsHtml = "";
  if (st === "concluida") {
    actionsHtml += `<button class="sheet-btn danger" id="sheet-btn-main">Desmarcar como concluída</button>`;
  } else {
    actionsHtml += `<button class="sheet-btn primary" id="sheet-btn-main">Marcar como concluída</button>`;
  }
  if (st === "planejada") {
    actionsHtml += `<button class="sheet-btn sheet-btn-cursando" id="sheet-btn-cursando">Remover de cursando</button>`;
  } else if (st === "disponivel" || st === "bloqueada") {
    actionsHtml += `<button class="sheet-btn sheet-btn-cursando" id="sheet-btn-cursando">Marcar como cursando</button>`;
  }
  // Botão de simulação (só aparece quando modo sim ativo)
  if (modoSim && !cursadas.has(id) && !planejadas.has(id)) {
    const emSim = simSet.has(id);
    actionsHtml += `<button class="sheet-btn" id="sheet-btn-sim" style="border-color:var(--c-simulada-bd);color:var(--c-simulada-txt);background:var(--c-simulada-bg)">${emSim ? '− Remover da simulação' : '+ Adicionar à simulação'}</button>`;
  }
  actionsHtml += `<button class="sheet-btn secondary" id="sheet-btn-close">Fechar</button>`;
  sheetActions.innerHTML = actionsHtml;

  document.getElementById("sheet-btn-main").addEventListener("click", () => {
    closeSheet();
    setTimeout(() => onCardClick(id), 10);
  });
  const btnCursando = document.getElementById("sheet-btn-cursando");
  if (btnCursando) btnCursando.addEventListener("click", () => {
    closeSheet();
    setTimeout(() => onCardRightClick(id), 10);
  });
  const btnSim = document.getElementById("sheet-btn-sim");
  if (btnSim) btnSim.addEventListener("click", () => {
    closeSheet();
    setTimeout(() => toggleSim(id), 10);
  });
  document.getElementById("sheet-btn-close").addEventListener("click", closeSheet);
}

sheetOverlay.addEventListener("click", closeSheet);

/* ═══════════════════════════════════════════════════════════════
   HEADER MENU
═══════════════════════════════════════════════════════════════ */
const menuBtn = document.getElementById("btn-menu");
const menuDropdown = document.getElementById("menu-dropdown");

function toggleMenu(e) {
  e.stopPropagation();
  menuDropdown.classList.toggle("open");
}
function closeMenu() { menuDropdown.classList.remove("open"); }

menuBtn.addEventListener("click", toggleMenu);
document.addEventListener("click", closeMenu);
menuDropdown.addEventListener("click", e => e.stopPropagation());

document.getElementById("menu-horas").addEventListener("click", () => { closeMenu(); openPanel(); });
document.getElementById("menu-compartilhar").addEventListener("click", () => { closeMenu(); doShare(); });
document.getElementById("menu-ajuda").addEventListener("click", () => { closeMenu(); openManual(); });
document.getElementById("menu-simular").addEventListener("click", () => { closeMenu(); toggleSimulacao(); });

/* ═══════════════════════════════════════════════════════════════
   SIMULAÇÃO DE SEMESTRE
═══════════════════════════════════════════════════════════════ */
const simSet = new Set();
let modoSim = false;

function saveSimState() {
  localStorage.setItem("ecp_simSet", JSON.stringify([...simSet]));
  localStorage.setItem("ecp_modoSim", modoSim ? "1" : "0");
}
function loadSimState() {
  try {
    const raw = localStorage.getItem("ecp_simSet");
    if (raw) JSON.parse(raw).forEach(id => { if (dMap[id]) simSet.add(id); });
    modoSim = localStorage.getItem("ecp_modoSim") === "1";
  } catch { }
}

function canAddToSim(id) {
  const d = dMap[id];
  if (!d) return false;
  const base = new Set([...cursadas, ...planejadas, ...simSet]);
  // Pré-requisitos precisam estar concluídos, cursando ou na simulação
  // (matrícula simultânea: A→B, se A está na sim, B também pode estar)
  return d.prereqs.every(pid => base.has(pid));
}

function toggleSim(id) {
  if (cursadas.has(id) || planejadas.has(id)) {
    showToast("Já está no seu progresso real");
    return;
  }
  if (simSet.has(id)) {
    simSet.delete(id);
  } else {
    if (!canAddToSim(id)) {
      const base = new Set([...cursadas, ...planejadas, ...simSet]);
      const missing = dMap[id]?.prereqs.filter(pid => !base.has(pid)).map(pid => dMap[pid]?.nome || pid) || [];
      showToast(`Adicione antes: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? "…" : ""}`);
      return;
    }
    simSet.add(id);
  }
  saveSimState();
  updateSimOverlay();
}

function isAvailableWith(d, set) {
  if (!d) return false;
  if (!d.prereqs.every(p => set.has(p))) return false;
  return d.coreqs.every(cid => {
    const coreq = dMap[cid];
    return !coreq || set.has(cid) || coreq.prereqs.every(p => p === d.id || set.has(p));
  });
}

function updateSimOverlay() {
  const base = new Set([...cursadas, ...planejadas, ...simSet]);
  const baseOld = new Set([...cursadas, ...planejadas]);
  document.querySelectorAll(".card").forEach(el => {
    const id = el.dataset.id;
    if (!modoSim) { el.removeAttribute("data-sim"); return; }
    if (simSet.has(id)) {
      el.dataset.sim = "simulada";
    } else if (!cursadas.has(id) && !planejadas.has(id)) {
      const d = dMap[id];
      const cobertosSim = isAvailableWith(d, base);
      const jaDisponivel = isAvailableWith(d, baseOld);
      if (cobertosSim && !jaDisponivel) {
        el.dataset.sim = "desbloqueia";
      } else {
        el.removeAttribute("data-sim");
      }
    } else {
      el.removeAttribute("data-sim");
    }
  });
  // Atualiza banner
  const n = simSet.size;
  document.getElementById("sim-count").textContent =
    n === 0 ? "nenhuma selecionada" : `${n} disciplina${n !== 1 ? "s" : ""}`;
}

function toggleSimulacao() {
  modoSim = !modoSim;
  saveSimState();
  document.getElementById("sim-banner").classList.toggle("active", modoSim);
  const menuSimBtn = document.getElementById("menu-simular");
  menuSimBtn.classList.toggle("sim-active", modoSim);
  menuSimBtn.querySelector("svg").style.color = modoSim ? "var(--c-simulada-bd)" : "";
  updateSimOverlay();
  showToast(modoSim ? "Modo simulação ativado — clique nas disciplinas para simular" : "Simulação encerrada");
}

document.getElementById("sim-clear").addEventListener("click", () => {
  simSet.clear();
  saveSimState();
  updateSimOverlay();
});
document.getElementById("sim-exit").addEventListener("click", () => {
  if (modoSim) toggleSimulacao();
});

/* ═══════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════ */
// Adaptar manual ao tipo de dispositivo
if (window.matchMedia("(pointer: coarse)").matches) {
  document.getElementById("manual-text-desktop").style.display = "none";
  document.getElementById("manual-text-mobile").style.display = "";
}

// Limpar destaques no mobile apenas com toques (sem scroll)
let globalTouchStartX = 0;
let globalTouchStartY = 0;
document.addEventListener("touchstart", (e) => {
  if (isTouchDevice && e.touches.length === 1) {
    globalTouchStartX = e.touches[0].clientX;
    globalTouchStartY = e.touches[0].clientY;
  }
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (isTouchDevice && e.changedTouches.length === 1) {
    const dx = Math.abs(e.changedTouches[0].clientX - globalTouchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - globalTouchStartY);
    if (dx <= 10 && dy <= 10) { // Toque rápido (tap), não scroll
      const card = e.target.closest('.card');
      // Limpa se tocou fora, ou se tocou num card já desfocado
      if (!card || card.classList.contains('dimmed')) {
        onCardLeave();
      }
    }
  }
}, { passive: true });

loadState();
loadSimState();
loadFromURL();
buildGrid();
updateAll();
// Restaurar modo simulação se estava ativo
if (modoSim) {
  document.getElementById("sim-banner").classList.add("active");
  document.getElementById("menu-simular").classList.add("sim-active");
  updateSimOverlay();
}
if (!localStorage.getItem("ecp_manual_seen")) openManual(true);


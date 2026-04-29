import "./style.css";
import { parseGrammar } from "./grammar.js";
import { convertToPDA } from "./converter.js";
import {
  EPSILON,
  formatSymbolSequence,
  transitionToString,
} from "./pda.js";
import { renderGraph } from "./visualizer.js";

const EXAMPLES = {
  anbn: {
    label: "aⁿbⁿ (classic)",
    grammar: "S -> aSb | ε",
    sampleInput: "aaabbb",
  },
};

const state = {
  activeTab: "formal",
  grammar: null,
  pda: null,
  simulation: null,
  exportMessageTimer: null,
};

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app-shell">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Browser-Only Formal Language Toolkit</p>
        <h1>CFG to PDA Converter</h1>
        <p class="hero-text">
          Parse a context-free grammar, validate it, convert it to a three-state pushdown automaton,
          visualize the machine, and step through the resulting computation trace.
        </p>
      </div>
    </header>

    <main class="workspace">
      <section class="panel input-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Grammar Input</p>
            <h2>Context-Free Grammar</h2>
          </div>
        </div>

        <div class="field-group">
          <label class="field">
            <span class="field-label">Built-in examples</span>
            <select id="exampleSelect" class="control">
              ${Object.entries(EXAMPLES)
                .map(
                  ([value, example]) =>
                    `<option value="${value}">${example.label}</option>`,
                )
                .join("")}
            </select>
          </label>

          <div class="input-hints">
            <span>Supports <code>→</code> and <code>-></code></span>
            <span>Use <code>|</code> for alternatives</span>
            <span><code>ε</code>, <code>eps</code>, or blank means epsilon</span>
          </div>

          <label class="field">
            <span class="field-label">Grammar editor</span>
            <div class="editor-shell">
              <pre id="lineNumbers" class="line-numbers">1</pre>
              <textarea
                id="grammarInput"
                class="grammar-input"
                spellcheck="false"
                autocapitalize="off"
                autocomplete="off"
                autocorrect="off"
                placeholder="S -> aS | bA | ε&#10;A -> bA | a"
              ></textarea>
            </div>
          </label>

          <div id="grammarSummary" class="summary-strip"></div>
          <div id="errorList" class="error-list" aria-live="polite"></div>

          <div class="action-row">
            <button id="convertBtn" class="button primary-button">Convert CFG to PDA</button>
            <button id="clearBtn" class="button secondary-button">Clear</button>
          </div>
        </div>
      </section>

      <section class="panel output-panel">
        <div class="panel-header output-header">
          <div>
            <p class="panel-kicker">Generated Machine</p>
            <h2>Pushdown Automaton Output</h2>
          </div>
          <div class="export-group">
            <button id="copyJsonBtn" class="button secondary-button" disabled>Copy JSON</button>
            <button id="downloadTxtBtn" class="button secondary-button" disabled>Download .txt</button>
          </div>
        </div>

        <div class="tabs" role="tablist" aria-label="PDA output tabs">
          <button class="tab-button active" data-tab="formal" role="tab">Formal Definition</button>
          <button class="tab-button" data-tab="table" role="tab">Transition Table</button>
          <button class="tab-button" data-tab="graph" role="tab">Graph View</button>
          <button class="tab-button" data-tab="simulator" role="tab">String Simulator</button>
        </div>

        <div class="tab-panel active" data-panel="formal">
          <div id="formalContent" class="empty-state">
            Convert a grammar to see the PDA formal definition.
          </div>
        </div>

        <div class="tab-panel" data-panel="table">
          <div id="tableContent" class="empty-state">
            The transition table will appear here after conversion.
          </div>
        </div>

        <div class="tab-panel" data-panel="graph">
          <div id="graphContainer" class="graph-container">
            <div class="graph-empty">The graph view becomes available after conversion.</div>
          </div>
        </div>

        <div class="tab-panel" data-panel="simulator">
          <div class="simulator-toolbar">
            <label class="field grow">
              <span class="field-label">Test string</span>
              <input
                id="simInput"
                class="control"
                type="text"
                placeholder="Enter a string over the grammar terminals"
              />
            </label>
            <div class="sim-buttons">
              <button id="prepareSimBtn" class="button secondary-button" disabled>Prepare</button>
              <button id="nextStepBtn" class="button secondary-button" disabled>Next Step</button>
              <button id="autoRunBtn" class="button primary-button" disabled>Auto Run</button>
              <button id="resetSimBtn" class="button ghost-button" disabled>Reset</button>
            </div>
          </div>

          <div id="simResult" class="result-banner neutral">
            Enter a string and prepare a computation path.
          </div>

          <div class="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>State</th>
                  <th>Remaining Input</th>
                  <th>Stack</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="simTableBody">
                <tr class="placeholder-row">
                  <td colspan="5">No simulation trace yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="exportMessage" class="export-message" aria-live="polite"></div>
      </section>
    </main>
  </div>
`;

const elements = {
  exampleSelect: document.querySelector("#exampleSelect"),
  grammarInput: document.querySelector("#grammarInput"),
  lineNumbers: document.querySelector("#lineNumbers"),
  grammarSummary: document.querySelector("#grammarSummary"),
  errorList: document.querySelector("#errorList"),
  convertBtn: document.querySelector("#convertBtn"),
  clearBtn: document.querySelector("#clearBtn"),
  copyJsonBtn: document.querySelector("#copyJsonBtn"),
  downloadTxtBtn: document.querySelector("#downloadTxtBtn"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
  tabPanels: [...document.querySelectorAll(".tab-panel")],
  formalContent: document.querySelector("#formalContent"),
  tableContent: document.querySelector("#tableContent"),
  graphContainer: document.querySelector("#graphContainer"),
  simInput: document.querySelector("#simInput"),
  prepareSimBtn: document.querySelector("#prepareSimBtn"),
  nextStepBtn: document.querySelector("#nextStepBtn"),
  autoRunBtn: document.querySelector("#autoRunBtn"),
  resetSimBtn: document.querySelector("#resetSimBtn"),
  simResult: document.querySelector("#simResult"),
  simTableBody: document.querySelector("#simTableBody"),
  exportMessage: document.querySelector("#exportMessage"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showExportMessage(message) {
  clearTimeout(state.exportMessageTimer);
  elements.exportMessage.textContent = message;
  state.exportMessageTimer = window.setTimeout(() => {
    elements.exportMessage.textContent = "";
  }, 2200);
}

function updateLineNumbers() {
  const lineCount = Math.max(1, elements.grammarInput.value.split("\n").length);
  elements.lineNumbers.textContent = Array.from(
    { length: lineCount },
    (_, index) => String(index + 1),
  ).join("\n");
}

function syncEditorScroll() {
  elements.lineNumbers.scrollTop = elements.grammarInput.scrollTop;
}

function formatSet(values) {
  return `{ ${values.length ? values.map((value) => escapeHtml(value)).join(", ") : "∅"} }`;
}

function renderErrors(errors) {
  if (!errors.length) {
    elements.errorList.innerHTML = "";
    elements.errorList.classList.remove("visible");
    return;
  }

  elements.errorList.classList.add("visible");
  elements.errorList.innerHTML = `
    <strong>Validation errors</strong>
    <ul>
      ${errors
        .map((error) => {
          const prefix = error.line ? `Line ${error.line}: ` : "";
          return `<li>${escapeHtml(prefix + error.message)}</li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderSummary(grammar) {
  if (!grammar) {
    elements.grammarSummary.innerHTML = "";
    return;
  }

  elements.grammarSummary.innerHTML = `
    <span class="summary-chip">Start: <code>${escapeHtml(grammar.startSymbol)}</code></span>
    <span class="summary-chip">Non-terminals: <code>${escapeHtml(grammar.nonTerminals.join(", "))}</code></span>
    <span class="summary-chip">Terminals: <code>${escapeHtml(grammar.terminals.join(", ") || "∅")}</code></span>
    <span class="summary-chip">Rules: <code>${grammar.productions.length}</code></span>
  `;
}

function clearRenderedOutput() {
  elements.formalContent.innerHTML =
    '<div class="empty-state">Convert a grammar to see the PDA formal definition.</div>';
  elements.tableContent.innerHTML =
    '<div class="empty-state">The transition table will appear here after conversion.</div>';
  elements.graphContainer.innerHTML =
    '<div class="graph-empty">The graph view becomes available after conversion.</div>';
  elements.copyJsonBtn.disabled = true;
  elements.downloadTxtBtn.disabled = true;
  state.pda = null;
  resetSimulationState({
    resetInput: false,
    message: "Enter a string and prepare a computation path.",
  });
}

function renderFormalDefinition(pda, grammar) {
  const deltaItems = pda.transitions
    .map(
      (transition) =>
        `<li><code>${escapeHtml(transitionToString(transition))}</code></li>`,
    )
    .join("");

  elements.formalContent.innerHTML = `
    <div class="formal-definition">
      <div class="math-line">M = (Q, Σ, Γ, δ, q₀, F)</div>
      <div class="definition-grid">
        <div class="definition-card">
          <h3>Q</h3>
          <p>${formatSet(pda.states)}</p>
        </div>
        <div class="definition-card">
          <h3>Σ</h3>
          <p>${formatSet(pda.inputAlphabet)}</p>
        </div>
        <div class="definition-card">
          <h3>Γ</h3>
          <p>${formatSet(pda.stackAlphabet)}</p>
        </div>
        <div class="definition-card">
          <h3>q₀</h3>
          <p><code>${escapeHtml(pda.startState)}</code></p>
        </div>
        <div class="definition-card">
          <h3>F</h3>
          <p>${formatSet(pda.acceptStates)}</p>
        </div>
        <div class="definition-card">
          <h3>Start symbol</h3>
          <p><code>${escapeHtml(grammar.startSymbol)}</code></p>
        </div>
      </div>
      <div class="definition-card wide-card">
        <h3>δ transitions</h3>
        <ul class="delta-list">${deltaItems}</ul>
      </div>
      <div class="note-strip">
        Acceptance style: <strong>empty stack</strong> after moving to <code>q_accept</code>.
      </div>
    </div>
  `;
}

function renderTransitionTable(pda) {
  const rows = pda.transitions
    .map(
      (transition) => `
        <tr>
          <td><code>${escapeHtml(transition.from)}</code></td>
          <td><code>${escapeHtml(transition.input)}</code></td>
          <td><code>${escapeHtml(transition.stackTop)}</code></td>
          <td><code>${escapeHtml(transition.to)}</code></td>
          <td><code>${escapeHtml(formatSymbolSequence(transition.pushSymbols))}</code></td>
        </tr>
      `,
    )
    .join("");

  elements.tableContent.innerHTML = `
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            <th>Current State</th>
            <th>Input</th>
            <th>Stack Top</th>
            <th>Next State</th>
            <th>Push to Stack</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderGraphPanel() {
  if (!state.pda) {
    elements.graphContainer.innerHTML =
      '<div class="graph-empty">The graph view becomes available after conversion.</div>';
    return;
  }

  renderGraph(state.pda, elements.graphContainer);
}

function setActiveTab(tabName) {
  state.activeTab = tabName;

  elements.tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });

  if (tabName === "graph") {
    window.requestAnimationFrame(renderGraphPanel);
  }
}

function renderSimulationTable() {
  const simulation = state.simulation;

  if (!simulation) {
    elements.simTableBody.innerHTML = `
      <tr class="placeholder-row">
        <td colspan="5">No simulation trace yet.</td>
      </tr>
    `;
    return;
  }

  const visibleRows = simulation.result.trace.slice(0, simulation.cursor);

  elements.simTableBody.innerHTML = visibleRows
    .map(
      (row) => `
        <tr>
          <td>${row.step}</td>
          <td><code>${escapeHtml(row.state)}</code></td>
          <td><code>${escapeHtml(row.remainingInput)}</code></td>
          <td><code>${escapeHtml(row.stack)}</code></td>
          <td>${escapeHtml(row.action)}</td>
        </tr>
      `,
    )
    .join("");
}

function updateSimulationButtons() {
  const hasPda = Boolean(state.pda);
  const simulation = state.simulation;
  const atEnd = simulation
    ? simulation.cursor >= simulation.result.trace.length
    : false;
  const autoRunning = Boolean(simulation?.autoTimer);

  elements.prepareSimBtn.disabled = !hasPda;
  elements.nextStepBtn.disabled = !hasPda || (simulation ? atEnd : false);
  elements.autoRunBtn.disabled = !hasPda || (simulation ? atEnd : false);
  elements.resetSimBtn.disabled = !simulation;
  elements.autoRunBtn.textContent = autoRunning ? "Stop Auto" : "Auto Run";
}

function updateSimulationBanner() {
  const simulation = state.simulation;

  if (!simulation) {
    elements.simResult.className = "result-banner neutral";
    elements.simResult.textContent = "Enter a string and prepare a computation path.";
    return;
  }

  if (simulation.cursor < simulation.result.trace.length) {
    elements.simResult.className = "result-banner pending";
    elements.simResult.textContent = `Prepared ${simulation.result.trace.length} step(s). Reveal the next transition or auto-run the rest.`;
    return;
  }

  if (simulation.result.accepted) {
    elements.simResult.className = "result-banner accepted";
    elements.simResult.textContent = `✅ Accepted — ${simulation.result.reason}`;
    return;
  }

  elements.simResult.className = "result-banner rejected";
  elements.simResult.textContent = `❌ Rejected — ${simulation.result.reason}`;
}

function resetSimulationState({ resetInput = false, message = null } = {}) {
  if (state.simulation?.autoTimer) {
    window.clearInterval(state.simulation.autoTimer);
  }

  state.simulation = null;

  if (resetInput) {
    elements.simInput.value = "";
  }

  renderSimulationTable();
  updateSimulationButtons();

  elements.simResult.className = "result-banner neutral";
  elements.simResult.textContent =
    message ?? "Enter a string and prepare a computation path.";
}

function prepareSimulation() {
  if (!state.pda) {
    return;
  }

  const result = state.pda.simulate(elements.simInput.value);
  state.simulation = {
    input: elements.simInput.value,
    result,
    cursor: Math.min(1, result.trace.length),
    autoTimer: null,
  };

  renderSimulationTable();
  updateSimulationButtons();
  updateSimulationBanner();
}

function ensureSimulationMatchesInput() {
  if (!state.pda) {
    return false;
  }

  if (!state.simulation || state.simulation.input !== elements.simInput.value) {
    prepareSimulation();
  }

  return Boolean(state.simulation);
}

function stopAutoRun() {
  if (state.simulation?.autoTimer) {
    window.clearInterval(state.simulation.autoTimer);
    state.simulation.autoTimer = null;
    updateSimulationButtons();
  }
}

function advanceSimulationStep() {
  if (!ensureSimulationMatchesInput()) {
    return;
  }

  const simulation = state.simulation;

  if (simulation.cursor < simulation.result.trace.length) {
    simulation.cursor += 1;
  }

  if (simulation.cursor >= simulation.result.trace.length) {
    stopAutoRun();
  }

  renderSimulationTable();
  updateSimulationButtons();
  updateSimulationBanner();
}

function toggleAutoRun() {
  if (!ensureSimulationMatchesInput()) {
    return;
  }

  if (state.simulation.autoTimer) {
    stopAutoRun();
    return;
  }

  state.simulation.autoTimer = window.setInterval(() => {
    if (
      !state.simulation ||
      state.simulation.cursor >= state.simulation.result.trace.length
    ) {
      stopAutoRun();
      return;
    }

    advanceSimulationStep();
  }, 500);

  updateSimulationButtons();
}

function buildTransitionDownload(pda) {
  return [
    "CFG to PDA Transition Listing",
    "",
    ...pda.transitions.map((transition) => transitionToString(transition)),
  ].join("\n");
}

function renderConvertedMachine(grammar, pda) {
  state.grammar = grammar;
  state.pda = pda;
  elements.copyJsonBtn.disabled = false;
  elements.downloadTxtBtn.disabled = false;
  renderSummary(grammar);
  renderErrors([]);
  renderFormalDefinition(pda, grammar);
  renderTransitionTable(pda);
  resetSimulationState({
    resetInput: false,
    message: "Enter a string and prepare a computation path.",
  });

  if (state.activeTab === "graph") {
    window.requestAnimationFrame(renderGraphPanel);
  }
}

function handleConvert() {
  stopAutoRun();
  const parsed = parseGrammar(elements.grammarInput.value);

  if (!parsed.valid) {
    state.grammar = null;
    renderSummary(null);
    renderErrors(parsed.errors);
    clearRenderedOutput();
    return;
  }

  renderConvertedMachine(parsed.grammar, convertToPDA(parsed.grammar));
}

elements.exampleSelect.addEventListener("change", () => {
  const example = EXAMPLES[elements.exampleSelect.value];
  elements.grammarInput.value = example.grammar;
  elements.simInput.value = example.sampleInput;
  updateLineNumbers();
  syncEditorScroll();
  handleConvert();
});

elements.grammarInput.addEventListener("input", () => {
  updateLineNumbers();
  renderErrors([]);
  renderSummary(null);
  if (state.pda) {
    clearRenderedOutput();
  }
});

elements.grammarInput.addEventListener("scroll", syncEditorScroll);
elements.convertBtn.addEventListener("click", handleConvert);

elements.clearBtn.addEventListener("click", () => {
  stopAutoRun();
  elements.grammarInput.value = "";
  elements.simInput.value = "";
  updateLineNumbers();
  syncEditorScroll();
  renderSummary(null);
  renderErrors([]);
  clearRenderedOutput();
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

elements.copyJsonBtn.addEventListener("click", async () => {
  if (!state.pda) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      JSON.stringify(state.pda.toJSON(), null, 2),
    );
    showExportMessage("PDA JSON copied to the clipboard.");
  } catch (error) {
    showExportMessage(
      `Clipboard copy failed${error instanceof Error ? `: ${error.message}` : "."}`,
    );
  }
});

elements.downloadTxtBtn.addEventListener("click", () => {
  if (!state.pda) {
    return;
  }

  const blob = new Blob([buildTransitionDownload(state.pda)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pda-transitions.txt";
  anchor.click();
  URL.revokeObjectURL(url);
  showExportMessage("Transition table downloaded as pda-transitions.txt.");
});

elements.prepareSimBtn.addEventListener("click", prepareSimulation);
elements.nextStepBtn.addEventListener("click", advanceSimulationStep);
elements.autoRunBtn.addEventListener("click", toggleAutoRun);
elements.resetSimBtn.addEventListener("click", () => {
  stopAutoRun();

  if (!state.pda) {
    resetSimulationState();
    return;
  }

  prepareSimulation();
});

elements.simInput.addEventListener("input", () => {
  stopAutoRun();
  resetSimulationState({
    resetInput: false,
    message: "Input changed. Prepare a new computation path.",
  });
});

const defaultExample = EXAMPLES.anbn;
elements.exampleSelect.value = "anbn";
elements.grammarInput.value = defaultExample.grammar;
elements.simInput.value = defaultExample.sampleInput;
updateLineNumbers();
syncEditorScroll();
setActiveTab("formal");
handleConvert();

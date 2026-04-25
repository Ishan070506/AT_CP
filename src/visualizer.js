import { EPSILON, formatSymbolSequence } from "./pda.js";

let activeNetwork = null;

function buildEdgeLabel(transition) {
  return `${transition.input || EPSILON}, ${transition.stackTop || EPSILON} / ${formatSymbolSequence(transition.pushSymbols)}`;
}

export function renderGraph(pda, containerId) {
  const container =
    typeof containerId === "string"
      ? document.getElementById(containerId)
      : containerId;

  if (!container) {
    return null;
  }

  if (activeNetwork) {
    activeNetwork.destroy();
    activeNetwork = null;
  }

  container.innerHTML = "";

  if (!window.vis?.Network || !window.vis?.DataSet) {
    container.innerHTML =
      '<div class="graph-empty">vis.js failed to load, so the graph view is unavailable.</div>';
    return null;
  }

  const nodes = new window.vis.DataSet([
    {
      id: "q_start",
      label: "q_start",
      x: -260,
      y: 0,
      fixed: true,
      shape: "ellipse",
      borderWidth: 2,
      color: {
        background: "#101820",
        border: "#00ff9f",
        highlight: { background: "#14252c", border: "#00ff9f" },
      },
      font: { color: "#e6edf3", face: "monospace", size: 18 },
    },
    {
      id: "q_loop",
      label: "q_loop",
      x: 0,
      y: 0,
      fixed: true,
      shape: "ellipse",
      borderWidth: 3,
      color: {
        background: "#0f1720",
        border: "#00ff9f",
        highlight: { background: "#17313b", border: "#00ff9f" },
      },
      font: { color: "#e6edf3", face: "monospace", size: 18 },
    },
    {
      id: "q_accept",
      label: "q_accept",
      x: 260,
      y: 0,
      fixed: true,
      shape: "ellipse",
      borderWidth: 5,
      color: {
        background: "#10221c",
        border: "#00ff9f",
        highlight: { background: "#18352b", border: "#00ff9f" },
      },
      font: { color: "#e6edf3", face: "monospace", size: 18 },
    },
  ]);

  const edges = new window.vis.DataSet(
    pda.transitions.map((transition, index) => ({
      id: transition.id,
      from: transition.from,
      to: transition.to,
      label: buildEdgeLabel(transition),
      arrows: "to",
      color: { color: "#8b949e", highlight: "#00ff9f" },
      font: {
        color: "#d9fff1",
        face: "monospace",
        size: 14,
        strokeWidth: 0,
      },
      width: transition.type === "accept" ? 3 : 2,
      smooth:
        transition.from === transition.to
          ? {
              enabled: true,
              type: "curvedCW",
              roundness: 0.2 + (index % 6) * 0.07,
            }
          : {
              enabled: true,
              type: "cubicBezier",
              roundness: 0.12,
            },
      selfReferenceSize: 28,
    })),
  );

  activeNetwork = new window.vis.Network(
    container,
    { nodes, edges },
    {
      autoResize: true,
      physics: false,
      interaction: {
        hover: true,
        dragNodes: false,
        dragView: true,
        zoomView: true,
      },
      layout: {
        improvedLayout: false,
      },
      edges: {
        selectionWidth: 0,
        hoverWidth: 0,
      },
    },
  );

  return activeNetwork;
}

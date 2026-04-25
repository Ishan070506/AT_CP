import { EPSILON, PDA, formatSymbolSequence } from "./pda.js";

export function convertToPDA(grammar) {
  const states = ["q_start", "q_loop", "q_accept"];
  const stackAlphabet = [...new Set([...grammar.nonTerminals, ...grammar.terminals, "$"])];
  const transitions = [];

  transitions.push({
    id: "T0",
    from: "q_start",
    input: EPSILON,
    stackTop: EPSILON,
    to: "q_loop",
    pushSymbols: [grammar.startSymbol, "$"],
    type: "initialize",
    action: `Initialize stack with ${formatSymbolSequence([grammar.startSymbol, "$"])}.`,
  });

  grammar.productions.forEach((production, index) => {
    transitions.push({
      id: `P${index + 1}`,
      from: "q_loop",
      input: EPSILON,
      stackTop: production.lhs,
      to: "q_loop",
      pushSymbols: production.rhs,
      type: "production",
      production,
      action: `Expand ${production.lhs} -> ${formatSymbolSequence(production.rhs)}.`,
    });
  });

  grammar.terminals.forEach((terminal, index) => {
    transitions.push({
      id: `M${index + 1}`,
      from: "q_loop",
      input: terminal,
      stackTop: terminal,
      to: "q_loop",
      pushSymbols: [],
      type: "match",
      action: `Match terminal ${terminal}.`,
    });
  });

  transitions.push({
    id: `T${transitions.length}`,
    from: "q_loop",
    input: EPSILON,
    stackTop: "$",
    to: "q_accept",
    pushSymbols: [],
    type: "accept",
    action: "Pop $ and move to q_accept.",
  });

  return new PDA({
    states,
    inputAlphabet: grammar.terminals,
    stackAlphabet,
    transitions,
    startState: "q_start",
    acceptStates: ["q_accept"],
    startSymbol: grammar.startSymbol,
    acceptanceMode: "empty-stack",
  });
}

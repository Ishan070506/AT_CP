const EPSILON = "ε";
const EPSILON_KEYWORDS = new Set(["ε", "eps", "epsilon"]);
const NON_TERMINAL_PATTERN = /^[A-Z](?:['0-9_]*)$/;

function dedupeErrors(errors) {
  const seen = new Set();
  return errors.filter((error) => {
    const key = `${error.line ?? "global"}:${error.message}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function tokenizeRightHandSide(text, lineNumber, errors) {
  const trimmed = text.trim();

  if (!trimmed || EPSILON_KEYWORDS.has(trimmed.toLowerCase())) {
    return [];
  }

  if (trimmed.includes(EPSILON)) {
    errors.push({
      line: lineNumber,
      message: "Epsilon must appear alone on the right-hand side.",
    });
    return null;
  }

  const tokens = [];
  let index = 0;

  while (index < trimmed.length) {
    const character = trimmed[index];

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (/[A-Z]/.test(character)) {
      let token = character;
      index += 1;

      while (index < trimmed.length && /['0-9_]/.test(trimmed[index])) {
        token += trimmed[index];
        index += 1;
      }

      tokens.push(token);
      continue;
    }

    if (/[a-z0-9]/.test(character)) {
      let token = character;
      index += 1;

      while (index < trimmed.length && /[a-z0-9]/.test(trimmed[index])) {
        token += trimmed[index];
        index += 1;
      }

      tokens.push(token);
      continue;
    }

    tokens.push(character);
    index += 1;
  }

  return tokens;
}

function isNonTerminal(symbol) {
  return NON_TERMINAL_PATTERN.test(symbol);
}

export function parseGrammar(text) {
  const source = typeof text === "string" ? text : "";
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const errors = [];
  const definitions = [];
  const productions = [];
  const definedNonTerminalSet = new Set();

  lines.forEach((lineText, lineIndex) => {
    const lineNumber = lineIndex + 1;
    const rawLine = lineText.trim();

    if (!rawLine) {
      return;
    }

    const normalizedLine = lineText.replace(/\u2192/g, "->");
    const arrowIndex = normalizedLine.indexOf("->");
    const secondArrowIndex =
      arrowIndex === -1 ? -1 : normalizedLine.indexOf("->", arrowIndex + 2);

    if (arrowIndex === -1 || secondArrowIndex !== -1) {
      errors.push({
        line: lineNumber,
        message: "Malformed rule. Use exactly one arrow such as S -> aS | ε.",
      });
      return;
    }

    const left = normalizedLine.slice(0, arrowIndex).trim();
    const right = normalizedLine.slice(arrowIndex + 2);

    if (!left) {
      errors.push({
        line: lineNumber,
        message: "Missing non-terminal on the left-hand side.",
      });
      return;
    }

    if (!isNonTerminal(left)) {
      errors.push({
        line: lineNumber,
        message:
          "Left-hand side must be a non-terminal such as S, A, or E'.",
      });
      return;
    }

    if (!definedNonTerminalSet.has(left)) {
      definedNonTerminalSet.add(left);
      definitions.push(left);
    }

    right.split("|").forEach((alternative) => {
      const rhs = tokenizeRightHandSide(alternative, lineNumber, errors);

      if (rhs !== null) {
        productions.push({
          lhs: left,
          rhs,
          line: lineNumber,
        });
      }
    });
  });

  const uniqueErrors = dedupeErrors(errors);

  if (!definitions.length) {
    uniqueErrors.push({
      line: null,
      message: "Missing start symbol. Add at least one production rule.",
    });
  }

  const startSymbol = definitions[0] ?? null;
  const terminals = [];
  const terminalSet = new Set();
  const referencedNonTerminals = new Map();

  productions.forEach((production) => {
    production.rhs.forEach((symbol) => {
      if (isNonTerminal(symbol)) {
        if (!referencedNonTerminals.has(symbol)) {
          referencedNonTerminals.set(symbol, production.line);
        }
        return;
      }

      if (!terminalSet.has(symbol)) {
        terminalSet.add(symbol);
        terminals.push(symbol);
      }
    });
  });

  referencedNonTerminals.forEach((lineNumber, symbol) => {
    if (!definedNonTerminalSet.has(symbol)) {
      uniqueErrors.push({
        line: lineNumber,
        message: `Undefined non-terminal referenced on the right-hand side: ${symbol}.`,
      });
    }
  });

  const finalErrors = dedupeErrors(uniqueErrors);

  if (finalErrors.length) {
    return {
      valid: false,
      grammar: null,
      errors: finalErrors,
    };
  }

  const productionMap = Object.fromEntries(
    definitions.map((nonTerminal) => [nonTerminal, []]),
  );

  productions.forEach((production, index) => {
    production.id = `P${index + 1}`;
    productionMap[production.lhs].push(production.rhs);
  });

  return {
    valid: true,
    errors: [],
    grammar: {
      startSymbol,
      nonTerminals: definitions,
      terminals,
      productions,
      productionMap,
      source,
      epsilon: EPSILON,
    },
  };
}

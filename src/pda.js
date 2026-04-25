export const EPSILON = "ε";
const MAX_CONFIGURATIONS = 5000;

function formatSingleSymbol(symbol) {
  return symbol && symbol !== EPSILON ? symbol : EPSILON;
}

export function formatSymbolSequence(symbols) {
  if (!symbols || symbols.length === 0) {
    return EPSILON;
  }

  const list = Array.isArray(symbols) ? symbols : [symbols];
  const needsSpacing = list.some((symbol) => symbol.length > 1);
  return needsSpacing ? list.join(" ") : list.join("");
}

export function formatStack(stack) {
  if (!stack || stack.length === 0) {
    return EPSILON;
  }

  return formatSymbolSequence([...stack].reverse());
}

export function transitionToString(transition) {
  return `δ(${transition.from}, ${formatSingleSymbol(transition.input)}, ${formatSingleSymbol(transition.stackTop)}) = (${transition.to}, ${formatSymbolSequence(transition.pushSymbols)})`;
}

function formatRemainingInput(tokens, index) {
  return formatSymbolSequence(tokens.slice(index));
}

function createTraceRow(step, state, tokens, inputIndex, stack, action) {
  return {
    step,
    state,
    remainingInput: formatRemainingInput(tokens, inputIndex),
    stack: formatStack(stack),
    action,
  };
}

function compareConfigs(currentBest, candidate) {
  if (candidate.inputIndex !== currentBest.inputIndex) {
    return candidate.inputIndex > currentBest.inputIndex;
  }

  if (candidate.stack.length !== currentBest.stack.length) {
    return candidate.stack.length < currentBest.stack.length;
  }

  return candidate.history.length > currentBest.history.length;
}

export class PDA {
  constructor({
    states,
    inputAlphabet,
    stackAlphabet,
    transitions,
    startState,
    acceptStates,
    startSymbol,
    acceptanceMode,
  }) {
    this.states = states;
    this.inputAlphabet = inputAlphabet;
    this.stackAlphabet = stackAlphabet;
    this.transitions = transitions;
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.startSymbol = startSymbol;
    this.acceptanceMode = acceptanceMode;
  }

  toJSON() {
    return {
      states: this.states,
      inputAlphabet: this.inputAlphabet,
      stackAlphabet: this.stackAlphabet,
      startState: this.startState,
      acceptStates: this.acceptStates,
      startSymbol: this.startSymbol,
      acceptanceMode: this.acceptanceMode,
      transitions: this.transitions.map((transition) => ({
        ...transition,
        push: formatSymbolSequence(transition.pushSymbols),
      })),
    };
  }

  tokenizeInput(inputString) {
    const source = typeof inputString === "string" ? inputString : "";
    const tokens = [];
    const terminals = [...this.inputAlphabet].sort(
      (left, right) => right.length - left.length || left.localeCompare(right),
    );

    let index = 0;

    while (index < source.length) {
      const character = source[index];

      if (/\s/.test(character)) {
        index += 1;
        continue;
      }

      const match = terminals.find((terminal) => source.startsWith(terminal, index));

      if (!match) {
        return {
          ok: false,
          tokens: [],
          error: `Unexpected symbol "${character}" at position ${index + 1}.`,
        };
      }

      tokens.push(match);
      index += match.length;
    }

    return {
      ok: true,
      tokens,
      error: null,
    };
  }

  getApplicableTransitions(configuration, nextToken) {
    return this.transitions.filter((transition) => {
      if (transition.from !== configuration.state) {
        return false;
      }

      if (transition.input !== EPSILON && transition.input !== nextToken) {
        return false;
      }

      if (transition.stackTop === EPSILON) {
        return true;
      }

      return configuration.stack[configuration.stack.length - 1] === transition.stackTop;
    });
  }

  applyTransition(configuration, transition, tokens) {
    const stack = [...configuration.stack];
    let inputIndex = configuration.inputIndex;

    if (transition.stackTop !== EPSILON) {
      const top = stack.pop();

      if (top !== transition.stackTop) {
        return null;
      }
    }

    if (transition.input !== EPSILON) {
      if (tokens[inputIndex] !== transition.input) {
        return null;
      }

      inputIndex += 1;
    }

    for (let index = transition.pushSymbols.length - 1; index >= 0; index -= 1) {
      stack.push(transition.pushSymbols[index]);
    }

    const history = [
      ...configuration.history,
      createTraceRow(
        configuration.history.length,
        transition.to,
        tokens,
        inputIndex,
        stack,
        transition.action,
      ),
    ];

    return {
      state: transition.to,
      inputIndex,
      stack,
      steps: configuration.steps + 1,
      history,
    };
  }

  simulate(inputString, options = {}) {
    const tokenized = this.tokenizeInput(inputString);
    const maxTransitions =
      options.maxTransitions ??
      Math.max(80, tokenized.tokens.length * 10 + 20);
    const maxStackDepth =
      options.maxStackDepth ??
      Math.max(48, tokenized.tokens.length * 8 + 24);

    if (!tokenized.ok) {
      return {
        accepted: false,
        completed: true,
        tokens: [],
        reason: tokenized.error,
        trace: [
          {
            step: 0,
            state: this.startState,
            remainingInput: inputString.trim() || EPSILON,
            stack: EPSILON,
            action: `Rejected before simulation: ${tokenized.error}`,
          },
        ],
      };
    }

    const tokens = tokenized.tokens;
    const initialConfiguration = {
      state: this.startState,
      inputIndex: 0,
      stack: [],
      steps: 0,
      history: [
        createTraceRow(0, this.startState, tokens, 0, [], "Start configuration"),
      ],
    };

    const queue = [initialConfiguration];
    const visited = new Set([
      `${initialConfiguration.state}|${initialConfiguration.inputIndex}|`,
    ]);
    let bestConfiguration = initialConfiguration;
    let processedCount = 0;

    while (queue.length && processedCount < MAX_CONFIGURATIONS) {
      const configuration = queue.shift();
      processedCount += 1;

      if (
        configuration.state === this.acceptStates[0] &&
        configuration.inputIndex === tokens.length &&
        configuration.stack.length === 0
      ) {
        return {
          accepted: true,
          completed: true,
          tokens,
          reason: "Accepted by reaching q_accept with an empty stack.",
          trace: configuration.history,
          processedCount,
        };
      }

      if (compareConfigs(bestConfiguration, configuration)) {
        bestConfiguration = configuration;
      }

      if (configuration.steps >= maxTransitions) {
        continue;
      }

      const nextToken = tokens[configuration.inputIndex];
      const transitions = this.getApplicableTransitions(configuration, nextToken);

      for (const transition of transitions) {
        const nextConfiguration = this.applyTransition(
          configuration,
          transition,
          tokens,
        );

        if (!nextConfiguration || nextConfiguration.stack.length > maxStackDepth) {
          continue;
        }

        const signature = `${nextConfiguration.state}|${nextConfiguration.inputIndex}|${nextConfiguration.stack.join("\u0001")}`;

        if (visited.has(signature)) {
          continue;
        }

        visited.add(signature);
        queue.push(nextConfiguration);
      }
    }

    const reason =
      processedCount >= MAX_CONFIGURATIONS
        ? "Search limit reached before finding an accepting computation."
        : "No accepting computation was found for this input string.";

    return {
      accepted: false,
      completed: true,
      tokens,
      reason,
      trace: [
        ...bestConfiguration.history,
        {
          step: bestConfiguration.history.length,
          state: bestConfiguration.state,
          remainingInput: formatRemainingInput(tokens, bestConfiguration.inputIndex),
          stack: formatStack(bestConfiguration.stack),
          action: reason,
        },
      ],
      processedCount,
    };
  }
}

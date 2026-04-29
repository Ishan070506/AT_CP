# AT_CP

A curated collection of algorithms, data structures, templates, and solved problems for Competitive Programming and Algorithmic Training.

> Short, well-organized resources and templates to help you quickly start solving contest problems and to use as a reference during contests.

## Contents & Purpose

This repository is intended to be a practical toolkit for:
- Fast problem setup (templates and I/O helpers)
- Reference implementations for common algorithms and data structures
- Worked examples for classical problems
- Notes and tips for contest strategies and edge cases

Great for self-study, contest prep, and quick reference during programming competitions.

## Highlights

- Clean, battle-tested templates for quick submission
- Implementations of commonly used algorithms: graph algorithms, shortest paths, flows, DSU, segment trees, binary indexed trees, string algorithms, geometry, number theory, etc.
- Problem folders with sample inputs/outputs and short explanations
- Multi-language support (C++ / Python / Java) — adjust per repository contents

## Recommended Repository Structure

(Organize files like this — update to match the repository contents)

- /cpp/              — C++ implementations and templates (preferred for contests)
- /python/           — Python solutions and utilities
- /java/             — Java implementations
- /templates/        — minimal contest templates (fast I/O, main loop)
- /problems/         — solved problems grouped by topic (with README for each)
- /notes/            — algorithm notes, complexity analyses, tips
- /tools/            — small helper scripts (generate tests, run local validator)
- README.md

## Getting Started

1. Clone the repository:
   git clone https://github.com/Ishan070506/AT_CP.git

2. Browse templates to pick the language you use most:
   - For C++, see `cpp/template.cpp`
   - For Python, see `python/template.py`

3. Compile and run a solution (C++ example):
   g++ -std=gnu++17 -O2 -pipe cpp/example.cpp -o example
   ./example < input.txt

4. For Python:
   python3 python/example.py < input.txt

(Adjust commands to match actual file names in the repo.)

## How to Use the Templates

- Copy your preferred template into a new file when starting a problem.
- Keep helper functions (fast I/O, debug macros) in the template for quick reuse.
- Follow the included comments for typical contest constraints and tips.

## Contribution Guide

Contributions welcome. Suggested process:
1. Fork the repo.
2. Add or improve implementations, templates, or problem write-ups.
3. Include tests or sample inputs where appropriate.
4. Open a pull request with a clear description and complexity notes.

Please follow these guidelines:
- Keep code clean and commented.
- Add time & memory complexity for each algorithm.
- Add references (problem links or textbook/URL) when relevant.

## Code Style & Naming

- Use clear, descriptive function names for reusable algorithms.
- Prefer short, contest-friendly naming in template files.
- Add a brief header comment to each solution with:
  - Problem name / link
  - Date
  - Complexity

## Testing & Validation

- Include sample input files in `/problems/XXX/` when possible.
- Provide a small script in `/tools/` to run tests locally (optional).

## License

This repository is provided as-is. If you want a license, consider adding an OSI-approved license such as MIT. Example: add `LICENSE` with MIT content.

## Roadmap / Ideas

- Add more topic-based collections (DP, graph theory, geometry).
- Add time-benchmarks and test harnesses.
- Add a curated list of solved problems by difficulty and tag.

---

If you'd like, I can:
- Tailor this README to the exact files and languages in your repo (send a file list or allow me to fetch them),
- Generate a ready-to-commit README.md and open a PR (if you give permission and repo details),
- Add badges (CI, license, languages) and examples taken directly from the repository.

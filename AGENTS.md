# Verbum — agent instructions

A roguelike word game (Wordle + Balatro). This file describes project-specific conventions an agent can't infer from the code alone. Read it before writing changes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

Verbum runs on **Next.js 16.2.6 with React 19**. APIs, conventions, and file structure may differ from your training data. Before writing any Next.js / React code, read the relevant guide in [node_modules/next/dist/docs/](node_modules/next/dist/docs/) — entry points are `01-app/01-getting-started/`, `01-app/02-guides/`, and `01-app/03-api-reference/`. Heed deprecation notices. The README claims "Next.js 15" — it's stale; trust `package.json`.

<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- Zustand 5 for game state
- Vitest 4 + Testing Library (jsdom) for tests
- `seedrandom` for deterministic run generation

## Layout

- [src/app/](src/app/) — App Router entry. Root layout, single page, global styles.
- [src/components/](src/components/) — React components. All current components are client (`'use client'`) because they read the Zustand store.
- [src/lib/](src/lib/) — pure game logic: state store, scoring, RNG, guess evaluation, word lists, shared types.
- [scripts/build-words.mjs](scripts/build-words.mjs) — generates [src/lib/words.generated.ts](src/lib/words.generated.ts) from the `.txt` sources. Runs automatically as `prebuild`.

Use the `@/*` path alias (maps to `src/*`) for cross-directory imports.

## Word lists — do not edit generated code

- [src/lib/words.generated.ts](src/lib/words.generated.ts) is **auto-generated**. Never hand-edit.
- To change the word pool, edit [src/lib/words.txt](src/lib/words.txt) (answers) or [src/lib/guesses.txt](src/lib/guesses.txt) (extra accepted guesses), then run `npm run build:words`.
- The build script lowercases, dedupes, sorts, and filters to `^[a-z]{5}$` — only 5-letter ASCII words survive. Don't try to add longer words without changing the script and the rest of the engine (`wordLength` currently flows from the picked target).

## Determinism

- Word selection lives in [src/lib/rng.ts](src/lib/rng.ts) and is seeded by `${seed}:${ante}:${round}`. Same seed → same run, every time.
- A seed can be supplied via the `?seed=` query param (see [SeedLoader.tsx](src/components/SeedLoader.tsx)); otherwise one is generated from `Date.now()`.
- Anything that affects which word is chosen, or in what order, must remain a pure function of the seed/ante/round. Don't introduce `Math.random()` or wall-clock reads into game logic.

## State

- Single Zustand store in [src/lib/store.ts](src/lib/store.ts) holds the full run (`RunState` + actions). Components select the slices they need — keep that pattern; do **not** call `useGameStore((s) => s)` and destructure, it forces re-renders on every change.
- Phases: `guessing` → `round_complete` → either next round or `game_over`. The store enforces transitions; UI should branch on `phase` rather than tracking its own.
- Invalid actions (wrong-length guess, non-word, key during wrong phase) must be silent no-ops — see existing guards in `submitGuess` / `addLetter`.
- Types in [src/lib/types.ts](src/lib/types.ts) are the source of truth for the shape of the game.

## Style & formatting

- Prettier is authoritative ([.prettierrc](.prettierrc)): **tabs**, single quotes, semicolons, trailing commas, 100-col width. The repo currently has a mix of tabs and 2-space indents — running `npm run format` will normalize. Do that before committing.
- ESLint extends `next/core-web-vitals` + `next/typescript` + `prettier`. Don't disable rules inline without a comment explaining why.
- TypeScript is `strict`. Don't use `any` to silence the compiler — narrow the type or extend the model in `types.ts`.

## Testing

- Run all tests: `npm test`. Watch mode: `npm run test:watch`.
- Tests live next to the code they cover (`*.test.ts` / `*.test.tsx`).
- Setup file [vitest.setup.ts](vitest.setup.ts) wires in `@testing-library/jest-dom` matchers.
- Pure logic in `src/lib/` is the easiest place to add coverage — see [evaluateGuess.test.ts](src/lib/evaluateGuess.test.ts) for the established style.
- When you change scoring, RNG, or guess evaluation, update or add tests in the same change.

## Commands

| Command                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Dev server with HMR                                |
| `npm run build`        | Production build (runs `build:words` first)        |
| `npm run build:words`  | Regenerate `words.generated.ts` from the txt files |
| `npm test`             | Vitest, run once                                   |
| `npm run lint`         | ESLint                                             |
| `npm run format`       | Prettier write                                     |
| `npm run format:check` | Prettier check (CI-friendly)                       |

## Before reporting a task done

- Run `npm run lint`, `npm test`, and `npm run format:check`. Fix what you broke.
- For UI changes, exercise the feature in the dev server if you can — both the golden path and the failure paths (invalid guess, losing a round, clearing an ante, game over, `?seed=` reload). If you can't drive a browser, say so and ask the user to verify the relevant flows rather than claiming success.
- If type checking, linting, or tests can't verify the change (e.g. visual tweaks), call that out explicitly.

## Project-aware suggestions

- Game-design changes (new mechanics, modifiers, ante curves) should land in `src/lib/` first as pure functions, then be surfaced through the store, then through components. Keep components thin.
- The roguelike framing is the point — when adding features, prefer designs that compose across runs and stack with future modifiers over one-off mechanics. Ask if scope is unclear; don't over-build.

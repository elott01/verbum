# Verbum 🚧

> A roguelike word game inspired by Wordle and Balatro. Guess words, build runs, stack modifiers, climb the ante.

![status](https://img.shields.io/badge/status-🚧%20day%202%20of%207-orange)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Vitest

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open <http://localhost:3000>. Append `?seed=<anything>` to replay a deterministic run.

## Scripts

| Command                | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Dev server with HMR                                         |
| `npm run build`        | Production build (regenerates the word list first)          |
| `npm run build:words`  | Rebuild `src/lib/words.generated.ts` from the `.txt` source |
| `npm test`             | Run unit tests once (Vitest)                                |
| `npm run test:watch`   | Vitest in watch mode                                        |
| `npm run lint`         | ESLint                                                      |
| `npm run format`       | Prettier write                                              |
| `npm run format:check` | Prettier check                                              |

## Contributing

See [AGENTS.md](./AGENTS.md) for project conventions — state shape, determinism rules, the auto-generated word list, and the formatting setup.

## License

MIT — see [LICENSE](./LICENSE).

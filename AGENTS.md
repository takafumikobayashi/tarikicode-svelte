# Repository Guidelines

## Project Structure & Module Organization

Code lives in `src/`: routes under `src/routes/` and shared utilities in `src/lib/`. Markdown posts reside in `src/posts/`; `src/tests/` hosts helpers and integration suites. Theme tokens in `src/theme/` (dark variants `src/theme/dark/`) compile to CSS in `static/`. Static assets (images, icons) are served from CloudFront CDN (`https://d1mt09hgbl7gpz.cloudfront.net`), referenced in `src/lib/AppConfig.ts`.

## Build, Test, and Development Commands

- `npm run dev`: start the Vite dev server with HMR.
- `npm run build`: produce the production bundle; run before shipping.
- `npm run preview`: serve the built app locally for final verification.
- `npm run check`: sync SvelteKit and run type/compiler checks.
- `npm run lint`: enforce quality checks across all files (Prettier + ESLint + markdownlint).
- `npm run lint:fix`: auto-fix all issues (code + markdown).
- `npm run lint:code` / `lint:code:fix`: code-only checks (TypeScript/Svelte).
- `npm run lint:md` / `fix:md`: markdown-only checks and fixes for article quality.
- `npm run format`: apply Prettier formatting.
- `npm run test`, `test:run`, `test:coverage`: run Vitest in watch, single-pass, or coverage mode.
- `npm run prepare`: rebuild SMUI themes after editing `src/theme/`.

## Coding Style & Naming Conventions

Prettier handles formatting: two-space indentation, trailing semicolons, single quotes. ESLint flags unused vars (prefix `_` to ignore) and limits `console` to `warn`/`error`. Components use PascalCase filenames, helpers use camelCase, and route files follow `+page.svelte`, `+layout.ts`, etc. Tests mirror their subjects with `.test.ts`.

## Testing Guidelines

Vitest runs in JSDOM via `src/tests/setup.ts`, which wires Testing Library cleanup. Prefer colocating unit tests; reserve `src/tests/` for integration or shared fixtures. Run `npm run test:coverage` before merging and review the HTML report in `coverage/` for gaps.

## Commit & Pull Request Guidelines

- Start subjects with Conventional Commit tags and keep them imperative under 72 characters with no trailing period.
- Use `feat:` new user-facing features, `fix:` bug fixes, `docs:` documentation-only changes, `style:` formatting, `refactor:` structural updates, `test:` tests or fixtures, `perf:` performance improvements, `build:` build tooling or deps, `ci:` pipelines, `chore:` maintenance, `revert:` rollbacks.
- Group related edits per commit; split config or dependency updates when practical.
- Add a body when context needs explanation; wrap lines at 72 characters.
- Pull requests must summarise intent, reference issues, and attach screenshots or terminal snippets for UX or CLI changes.
- Call out theme recompilation or migrations reviewers must run locally.

## Theming & Configuration Notes

Regenerate theme CSS with `npm run smui-theme-light` or `npm run smui-theme-dark`; outputs live in `static/`. Keep `vite.config.ts`, `vitest.config.ts`, `svelte.config.js`, and `tsconfig.json` aligned when changing aliases or environments.

## Collaboration Norms

Default to Japanese for issues, pull requests, and chat unless stakeholders request another language. Add English summaries only when referencing upstream documentation.

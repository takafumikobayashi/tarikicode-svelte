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

Vitest runs in happy-dom via `src/tests/setup.ts`, which wires Testing Library cleanup. Prefer colocating unit tests; reserve `src/tests/` for integration or shared fixtures. Run `npm run test:coverage` before merging and review the HTML report in `coverage/` for gaps.

### Current Test Suite

As of 2025-12-06, the test suite contains **71 passing tests** across 5 test files:
- `src/lib/ShareButtons.test.ts`: Social sharing buttons (10 tests)
- `src/lib/CommonFunction.test.ts`: Utility functions
- `src/lib/utils/posts.test.ts`: Blog post metadata extraction
- `src/lib/AppConfig.test.ts`: Site configuration
- `src/tests/integration/`: Integration tests

### Unit Testing Best Practices

**Mocking Read-Only Properties**: When mocking browser APIs with read-only properties (like `navigator.clipboard`), use `Object.defineProperty` instead of `Object.assign`:

```typescript
// ✓ Correct: Object.defineProperty for read-only properties
beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined)
    },
    writable: true,
    configurable: true
  });
});

// ✗ Wrong: Object.assign fails with "Cannot set property"
Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
```

### Unit vs E2E Testing Strategy

**Use Unit Tests for**:
- Pure functions and utilities
- UI components with clear inputs/outputs
- Business logic that can be isolated
- Mocking simple dependencies (fetch, timers, etc.)

**Use E2E Tests (Playwright) for**:
- Build-time features like `import.meta.glob` (cannot be mocked at runtime)
- Complex security logic with multiple layers (DNS validation, SSRF protection, redirect handling)
- Integration flows spanning multiple systems
- Features requiring real browser environment

**Removed Tests** (E2E coverage recommended):
- `src/tests/blog-page-server.test.ts`: Blog post loading uses `import.meta.glob` (Vite build-time feature)
- `src/tests/api-ogp.test.ts`: OGP API uses `undici` with 200+ lines of security code (DNS checks, SSRF protection)

These features are better tested via E2E tests with actual HTTP requests and file system operations rather than complex mocks.

## Version Control with jj (Jujutsu)

This project uses **jj (Jujutsu VCS)** for version control. Jj provides a more intuitive interface while maintaining Git compatibility under the hood.

### Daily Development Workflow

1. **Check current state**:

    ```bash
    jj status              # view working copy changes
    jj log -n 5            # review recent commits
    jj bookmark list       # check bookmark positions
    ```

2. **Start new work**:

    ```bash
    jj new                 # create new change on top of current
    # Make your code changes
    jj describe -m "feat: add new feature"  # set commit message
    ```

3. **Update develop bookmark** (recommended before pushing):

    ```bash
    jj bookmark set develop   # move develop bookmark to current commit
    ```

4. **Sync with remote**:

    ```bash
    jj git fetch              # pull latest from GitHub
    jj git push               # push local changes to remote
    ```

### Bookmark (Branch) Management

- **develop**: primary development bookmark, always tracks latest work
- **main**: production bookmark, synced with GitHub main branch
- Keep `develop` bookmark updated with `jj bookmark set develop` after completing changes
- Before pushing, ensure `develop` points to your latest commit

### Integration with Cursor/IDEs

Some editors (like Cursor) may display commit hashes instead of bookmark names. Run `jj bookmark set develop` to update the bookmark reference, making it display correctly in the IDE.

### Key Differences from Git

- **Automatic commits**: `jj new` creates a commit immediately; no staging area
- **Change IDs**: each logical change has a stable ID, separate from commit hash
- **Bookmarks vs Branches**: bookmarks in jj behave like Git branches but with clearer semantics
- **No detached HEAD**: working copy always sits on a commit; bookmarks can be moved freely

### Common Operations

| Task              | jj Command                | Git Equivalent                |
| ----------------- | ------------------------- | ----------------------------- |
| Check status      | `jj status`               | `git status`                  |
| View log          | `jj log -n 5`             | `git log -5`                  |
| Start new work    | `jj new`                  | `git commit` (after staging)  |
| Set message       | `jj describe -m "msg"`    | `git commit --amend -m "msg"` |
| Move bookmark     | `jj bookmark set develop` | `git checkout develop`        |
| Push to remote    | `jj git push`             | `git push`                    |
| Fetch from remote | `jj git fetch`            | `git fetch`                   |
| View diff         | `jj diff`                 | `git diff`                    |

For full reference, consult the [jj documentation](https://martinvonz.github.io/jj/latest/).

## Commit & Pull Request Guidelines

- Start subjects with Conventional Commit tags and keep them imperative under 72 characters with no trailing period.
- Use `feat:` new user-facing features, `fix:` bug fixes, `docs:` documentation-only changes, `style:` formatting, `refactor:` structural updates, `test:` tests or fixtures, `perf:` performance improvements, `build:` build tooling or deps, `ci:` pipelines, `chore:` maintenance, `revert:` rollbacks.
- Group related edits per commit; split config or dependency updates when practical.
- Add a body when context needs explanation; wrap lines at 72 characters.
- Pull requests must summarise intent, reference issues, and attach screenshots or terminal snippets for UX or CLI changes.
- Call out theme recompilation or migrations reviewers must run locally.
- Before committing, ensure the workspace is clean after running `npm run test`, `npm run lint` (or `lint:fix` when fixes are needed), and `npm run lint:md`; all must pass with zero failures.

## Theming & Configuration Notes

Regenerate theme CSS with `npm run smui-theme-light` or `npm run smui-theme-dark`; outputs live in `static/`. Keep `vite.config.ts`, `vitest.config.ts`, `svelte.config.js`, and `tsconfig.json` aligned when changing aliases or environments.

## Collaboration Norms

Default to Japanese for issues, pull requests, and chat unless stakeholders request another language. Add English summaries only when referencing upstream documentation.

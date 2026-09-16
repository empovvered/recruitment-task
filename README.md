# Recruitment task

Proof of concept built on Next.js 16 (App Router), React 19 and Tailwind CSS 4. Formatting, linting, commit
conventions and git hooks are configured and enforced; see Conventions below. Kept to what a POC actually
needs.

## Setup

Requires Node.js 22 (22.12.0 or newer) and pnpm 10.22.0. `corepack enable` picks the right pnpm up from the
`packageManager` field.

```bash
pnpm install   # also runs `prepare`, which installs the git hooks
pnpm dev       # http://localhost:3000
```

If git reports that a hook `was ignored because it's not set as executable`, run `chmod ug+x .husky/*`.

## Available commands

| Command            | What it does                                                          |
| ------------------ | --------------------------------------------------------------------- |
| `pnpm dev`         | Start the development server on port 3000                             |
| `pnpm build`       | Production build                                                      |
| `pnpm start`       | Serve the production build                                            |
| `pnpm lint`        | Run ESLint over the repository                                        |
| `pnpm lint:fix`    | Run ESLint and apply every autofix                                    |
| `pnpm format`      | Rewrite the tree with Prettier                                        |
| `pnpm format:check`| Fail if anything is not Prettier-formatted                            |
| `pnpm typecheck`   | Generate Next's route types, then type-check with no emit             |

## Conventions

### Commits and branches

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope)?: subject`,
where `type` is one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test` or `ci`. This is enforced by
commitlint in the `commit-msg` hook, so a malformed message is rejected before the commit is created.

Branch names must be `main`, `develop`, or `feature|bugfix|hotfix|release|chore/<name>`. This is checked in
`pre-commit`.

### Code style

Prettier owns formatting: no semicolons, double quotes, 120 columns, trailing commas, and Tailwind classes
sorted by `prettier-plugin-tailwindcss`. ESLint layers the Next.js core-web-vitals and TypeScript presets on
top, and adds `prettier/prettier`, sorted imports, `@stylistic` blank-line rules, `type` over `interface`,
and a ban on `any`.

Two hooks keep this honest: `pre-commit` runs lint-staged (`tsc`, `eslint --fix`, `prettier --write` over the
staged files only), and `pre-push` runs `pnpm typecheck` and `pnpm lint` over the whole repository.

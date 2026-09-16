# Recruitment task

A small panel listing loan applications, where the table is driven by column metadata rather than a hand-written list of
columns: labels, order, visibility, value types and action availability all come from `data/columns.json`.

Built on Next.js 16 (App Router), React 19 and Tailwind CSS 4. Formatting, linting, commit conventions and git hooks are
configured and enforced; see Conventions below. Kept to what a POC actually needs.

## Setup

Requires Node.js 22 (22.12.0 or newer) and pnpm 10.22.0. `corepack enable` picks the right pnpm up from the
`packageManager` field.

```bash
pnpm install   # also runs `prepare`, which installs the git hooks
pnpm dev       # http://localhost:3000
```

If git reports that a hook `was ignored because it's not set as executable`, run `chmod ug+x .husky/*`.

## Seeing it work

The states the task asks for are reachable from the address bar, so none of them needs a code change to demonstrate:

| URL                   | What it shows                           |
| --------------------- | --------------------------------------- |
| `/`                   | the loaded table                        |
| `/?delay=2000`        | the loading placeholder, then the table |
| `/?empty=1`           | the empty state                         |
| `/?fail=1`            | the error state with a retry            |
| `/?delay=1500&fail=1` | loading first, then the error           |

The view state is in the address too, so a filtered, sorted page is a link:
`/?status=approved&search=anna&sort=monthlyRate&order=desc&page=2`.

## Available commands

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Start the development server on port 3000                 |
| `pnpm build`        | Production build                                          |
| `pnpm start`        | Serve the production build                                |
| `pnpm lint`         | Run ESLint over the repository                            |
| `pnpm lint:fix`     | Run ESLint and apply every autofix                        |
| `pnpm format`       | Rewrite the tree with Prettier                            |
| `pnpm format:check` | Fail if anything is not Prettier-formatted                |
| `pnpm typecheck`    | Generate Next's route types, then type-check with no emit |
| `pnpm test`         | Run the test suite once                                   |
| `pnpm test:watch`   | Run the test suite in watch mode                          |

## The metadata model

Columns are described in one place, as a union discriminated on `type`:

```ts
type BaseColumn = {
  key: string
  label: string
  sortable?: boolean // absent means the column cannot be sorted
  filterable?: boolean // absent means it takes part in neither the status filter nor the search
  visible?: boolean // absent means visible
  order?: number // absent means "position in the metadata array"
}

export type ColumnMeta =
  | (BaseColumn & { type: "text" | "number" | "currency" | "date" })
  | (BaseColumn & { type: "badge"; options: readonly string[] })
  | (BaseColumn & { type: "action"; action: "edit" | "view" | "delete" })
```

`buildColumnDefs(metadata)` turns that into the table's column definitions: accessor, comparator, sort and filter flags,
and a cell renderer per type. Nothing downstream of it names a column.

Two details are worth knowing because the fixtures make them easy to get wrong:

- **`visible` and `order` are not in the fixtures.** They are optional in the model with the defaults above, so the
  behaviour the task asks for exists without editing the supplied data.
- **An action column names a permission, not a field.** `{ key: "canEdit", type: "action" }` is read from
  `row.permissions.canEdit`; `row.canEdit` does not exist. Reading the row directly disables every action on every row,
  which looks like working code. One function, `readCellValue`, is the only place that distinction lives.

## Technical decisions

| Decision                                                | Why                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route handler at `/api/applications` as the data source | The task allows a mock or a simulated request. A real `fetch` makes loading, empty and error genuine rather than staged, and the fixtures are imported server-side so the 290 KB payload never reaches the browser.                                                                                                                                    |
| `?fail=1`, `?empty=1`, `?delay=ms`                      | Every required state is reachable from the URL, so a reviewer can see all four without editing code.                                                                                                                                                                                                                                                   |
| React Query for async state                             | `isPending` / `isError` / `refetch` map onto the required states directly. `retry` is off, because the default three backed-off attempts would hide the error state behind about seven seconds of spinner.                                                                                                                                             |
| A headless table library behind our own wrapper         | Sorting, filtering and pagination are solved problems. Feature code never imports the library, so replacing it stays a local change.                                                                                                                                                                                                                   |
| Client-side pagination, 25 rows a page                  | 1200 rows fit in memory comfortably. Virtualisation would be weight without benefit at this size.                                                                                                                                                                                                                                                      |
| Comparators written by hand                             | "Sensible behaviour for missing values" is the graded part, so it is explicit and unit-tested rather than inherited from a default.                                                                                                                                                                                                                    |
| Fixtures parsed against a schema at the route handler   | Metadata is the one input the UI cannot recover from: an unknown column type has no cell renderer. Parsing names the offending path once, at the boundary, instead of leaving a blank column to be found by eye. It runs once per server instance, not per request.                                                                                    |
| The whole view state lives in search params             | Sorting, the status filter, the search term and the page are in the URL, so a filtered view is a link: it survives a reload, it can be pasted into a bug report, and the back button walks the states a reviewer went through. One hook owns the mapping.                                                                                              |
| An error boundary around the table                      | A failed request is only half of error handling. A row that throws while rendering would otherwise replace the page with the framework's default screen; instead the table falls back to a message with a retry and the page around it survives.                                                                                                       |
| The search term is debounced                            | Every keystroke would otherwise re-filter 1200 rows and write the address bar. Debouncing means the work happens once the typing settles, and a seven letter query leaves one URL entry rather than seven.                                                                                                                                             |
| The failure carries what the server said                | The route fails for two different reasons: the service being unavailable, and the fixtures not matching their contract. A generic message would send a reader hunting a network problem when the real fault is a malformed column. A thrown value that is not ours falls back to the generic line rather than putting an exception in front of a user. |
| The loading state is drawn, not just announced          | Skeletons swap into the cell renderers so the table keeps its shape. The columns arrive with the rows, though, so the first load has nothing to hang them on and would draw empty rows; until the metadata is known the placeholder is a stack of bars instead.                                                                                        |
| Vitest and Testing Library                              | Tests assert what a user sees — a disabled action, a narrowed list — instead of component internals.                                                                                                                                                                                                                                                   |

## Assumptions

- **Currency is derived from `market`** (`PL→PLN`, `CZ→CZK`, `DE/SK→EUR`, `RO→RON`), because the rows carry an amount
  but no currency. An unknown market renders a plain number rather than guessing.
- **`updatedAt` is ISO UTC** and is rendered in `pl-PL` in UTC, so the displayed day does not shift with the viewer's
  timezone.
- **Missing values render as `—`** and sort last in both directions.
- The fixtures contain no nulls, so the missing-value behaviour is covered by test fixtures of our own.

## Principles this solution follows

**Make the compiler carry the rule.** The column union is discriminated on `type`, and the cell renderer ends in a
`never` assignment. Adding a column type to the metadata without teaching the renderer about it is a build error, not a
blank cell found in review:

```ts
default: {
  const exhaustive: never = column
  return exhaustive
}
```

**A rule lives in exactly one place.** "Narrowing the result returns you to page one" is written once, in the hook that
owns the view state. Spread across the call sites it has to be repeated at each, and the one that forgets strands the
user on an empty page twelve of three:

```ts
const setSearch = useCallback(
  (search: string) => {
    void setParams({ [SearchParams.Search]: search || null, [SearchParams.Page]: DEFAULT_PAGE_INDEX })
  },
  [setParams],
)
```

**Accessibility belongs to the component, not to a later pass.** The table carries a caption, every sortable header
reports its direction through `aria-sort`, the loading state is both drawn and announced through `aria-busy` and a live
status line, and an action the row does not permit is a genuinely disabled button rather than a greyed-out one that
still takes focus and a click.

**Let the test find the boundary.** Two defects here were written, then caught by their own tests rather than by review:
keeping gaps at the bottom cannot live in a comparator, because the table negates a comparator result for a descending
sort — it is `sortUndefined: "last"` on the column; and `Date.parse` returning `NaN` for a malformed date leaves the
result of `Array.sort` unspecified, so one bad timestamp would scramble a column.

## Where things live

```
src/api/apiActions/applications   the endpoint's types, schema, query options, fetcher and error
src/api/queryClient.ts            the React Query client factory
src/app                           the route, the panel entry, the route handler and the error file
src/components/applicationsTable  everything that knows what an application is
src/components/table              a table that does not: columns in, rows out
src/components/form, search       the field vocabulary the toolbar is built from
src/components/error, skeleton    the states, shared by every caller
src/hooks                         the view state in the URL, and the debounce behind the search
src/constants, types, utils       search param names, page sizes, domain unions, cn
```

Files sit next to what they serve, with the suffix saying what they are: `.types`, `.utils`, `.queries`, `.schema`,
`.constants`, `.test`.

## Conventions

### Commits and branches

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope)?: subject`, where
`type` is one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test` or `ci`. This is enforced by commitlint in the
`commit-msg` hook, so a malformed message is rejected before the commit is created.

Branch names must be `main`, `develop`, or `feature|bugfix|hotfix|release|chore/<name>`. This is checked in
`pre-commit`.

### Code style

Prettier owns formatting: no semicolons, double quotes, 120 columns, trailing commas, and Tailwind classes sorted by
`prettier-plugin-tailwindcss`. ESLint layers the Next.js core-web-vitals and TypeScript presets on top, and adds
`prettier/prettier`, sorted imports, `@stylistic` blank-line rules, `type` over `interface`, and a ban on `any`.

Two hooks keep this honest: `pre-commit` runs lint-staged (`pnpm typecheck`, plus `eslint --fix` and `prettier --write`
over the staged files only), and `pre-push` runs `pnpm typecheck` and `pnpm lint` over the whole repository.

## What I would do next, with another 60–90 minutes

1. **Distinguish "no data" from "no matches".** Both render the same empty state today; the second should say which
   filter is responsible and offer to clear it.
2. **Finish the accessibility pass.** A page change does not move focus back to the top of the table, the reason an
   action is disabled is carried by `title` alone, which assistive technology often skips, and the pagination controls
   are not a labelled region.
3. **Column visibility and ordering as a user control.** The model already supports both; only the UI is missing.
4. **Server-side paging, filtering and sorting.** The table already takes `pageCount` and the view state is already in
   the URL, so the query layer is the only part that changes once an endpoint pages.

# Arctic Kanban

A task board with drag-and-drop, built with React 19, TypeScript and Tailwind CSS 4.
State lives entirely in the browser — there is no backend.

## Quick start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173/kanban-board/` (the `/kanban-board/` path
comes from the `base` setting in `vite.config.ts`, which exists so the build works
on GitHub Pages).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, then produce a production build in `dist/` |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint over the whole project |
| `npm run typecheck` | TypeScript with no emit |
| `npm run preview` | Serve the production build locally |

## Features

Board and list views over the same task set, with drag-and-drop between and within
columns. Tasks carry a title, description, priority, tags, assignee, status and due
date. Filters cover all tasks, your tasks, high priority and overdue; search matches
title, description and tags.

Deleting a task asks for confirmation and can be undone from the toast that follows.
The In Progress and Review columns have soft WIP limits that turn the count amber
once exceeded. The summary strip along the bottom derives completion, in-progress,
overdue and due-this-week counts from the current board.

Press <kbd>N</kbd> for a new task and <kbd>/</kbd> to focus search. Cards are
reachable by keyboard: <kbd>Enter</kbd> edits, <kbd>Space</kbd> starts a drag and
the arrow keys move it.

## Persistence

The whole board is serialised to `localStorage` under `kanban-board-data-v4`. It is
validated on read, so a stale or hand-edited payload falls back to the sample board
rather than breaking the first render. Changes also sync across tabs via the
`storage` event. "Reset to sample board" in the sidebar restores the seed data and
is undoable.

Bumping the version suffix on the storage key is the migration strategy — there is
no upgrade path between shapes.

## Project structure

```
src/
├── components/
│   ├── KanbanBoard.tsx     # Composition root: state, filtering, layout
│   ├── KanbanColumn.tsx    # Droppable column with WIP limit and empty state
│   ├── TaskCard.tsx        # Sortable card (memoised)
│   ├── TaskListView.tsx    # Flat list view, sorted by priority then due date
│   ├── TaskModal.tsx       # Create/edit form
│   ├── Sidebar.tsx         # Brand, view switcher, primary CTA, reset
│   ├── TopNav.tsx          # Search and avatar stack
│   ├── Toolbar.tsx         # Filter pills
│   ├── BoardStats.tsx      # Derived summary strip
│   ├── NowProvider.tsx     # Shared clock for relative timestamps
│   └── ui/                 # Modal, Icon, form controls, toast
├── hooks/
│   ├── useKanbanBoard.ts   # Board state, drag handling, single-level undo
│   ├── useLocalStorage.ts  # Validated, cross-tab persistence
│   ├── useBoardStats.ts    # Derived metrics
│   ├── useKeyboardShortcuts.ts
│   └── useNow.ts           # Clock context
├── data/
│   ├── config.ts           # Priorities, columns, users, tags
│   └── seed.ts             # Sample board
├── utils/date.ts           # Relative and due-date formatting
└── types/index.ts
```

Two conventions worth knowing:

- **Date helpers take `now` as an argument** rather than calling `Date.now()`. That
  keeps rendering pure and lets one shared timer refresh every relative label.
- **Priority styling lives in one place** (`PRIORITY_CONFIG`). Tailwind scans source
  for literal class names, so those strings must stay literal rather than being
  assembled at runtime.

## Testing

Vitest with jsdom and Testing Library. The suite covers the board reducer
(cross-column moves, drop positioning, undo) and the rendered app (task creation,
search, delete confirmation, dialog focus behaviour, recovery from corrupt storage).

```bash
npm test
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which lints, typechecks,
tests, builds and publishes to GitHub Pages. `.github/workflows/ci.yml` runs the same
checks on pull requests.

To enable it, go to **Settings → Pages** and select **GitHub Actions** as the source.
If your repository is not named `kanban-board`, update `base` in `vite.config.ts` to
match, or the built asset URLs will 404.

## License

MIT

# Suggested Commands

## Development
```bash
pnpm run dev           # Start all apps (web on port 3001)
pnpm run dev:web       # Web app only (via turbo filter)
```

## Build & Validation
```bash
pnpm run build         # Production build all packages + apps (Turborepo)
pnpm run check-types   # TypeScript validation across workspace
pnpm run lint          # Lint entire workspace (Ultracite/Biome)
pnpm run knip          # Find unused exports, deps, files
```

## Quick Validation (run after any code change)
```bash
pnpm run check-types && pnpm run lint && pnpm run knip
```

## Code Quality
```bash
pnpm run fix           # Auto-fix lint/format issues (Ultracite/Biome)
pnpm run check         # Check without fixing
```

## Dependency Management
```bash
pnpm run check-deps    # Check for outdated dependencies
pnpm run update-deps   # Update dependencies interactively
```

## System Utilities (macOS/Darwin)
```bash
git status / git diff / git log   # Git operations
ls / find / grep                   # File system (standard unix)
```

## Pre-commit Hooks
Husky runs lint-staged automatically on commit, which applies `ultracite fix` to staged files.
Commitlint enforces conventional commit messages.

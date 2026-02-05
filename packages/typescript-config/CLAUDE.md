# TypeScript Config Package - CLAUDE.md

Shared TypeScript configuration presets for the monorepo. Configuration-only package with no runtime dependencies.

## Presets

### `base.json` (Foundation)

Strict TypeScript config for backend/utility packages. Key settings:
- `strict: true` with `noUncheckedIndexedAccess: true`
- `module: "NodeNext"` / `moduleResolution: "NodeNext"`
- `target: "ES2022"` with `lib: ["es2022", "DOM", "DOM.Iterable"]`
- `declaration: true` + `declarationMap: true` for .d.ts generation
- `isolatedModules: true`, `skipLibCheck: true`

**Used by**: `database`, `embeddings`, `scraper`

### `nextjs.json` (Extends base.json)

Optimized for Next.js apps. Overrides:
- `module: "ESNext"` / `moduleResolution: "Bundler"` (Next.js handles bundling)
- `jsx: "preserve"` (Next.js transforms JSX)
- `noEmit: true` (Next.js handles compilation)
- `plugins: [{ name: "next" }]` for Next.js type checking
- `allowJs: true`

**Used by**: `apps/web`

### `react-library.json` (Extends base.json)

Minimal additions for React component libraries:
- `jsx: "react-jsx"` (React 17+ automatic transform)

**Used by**: `packages/ui`

## Usage in Consuming Packages

```json
{
  "extends": "@codeforge-v2/typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "strictNullChecks": true
  }
}
```

## Workspace Usage Map

| Package/App | Preset | Custom Overrides |
|---|---|---|
| `apps/web` | `nextjs.json` | `@/*` path alias, Next.js generated types |
| `packages/database` | `base.json` | `rootDir`, `outDir`, `strictNullChecks` |
| `packages/embeddings` | `base.json` | `rootDir`, `outDir`, `strictNullChecks` |
| `packages/scraper` | `base.json` | `rootDir`, `outDir`, `strictNullChecks` |
| `packages/ui` | `react-library.json` | `outDir`, `strictNullChecks` |

## Important

- **Changes affect the entire monorepo** - modify presets with care
- All packages inherit strict mode from base
- Declaration files are generated for all packages (consumed as workspace dependencies)

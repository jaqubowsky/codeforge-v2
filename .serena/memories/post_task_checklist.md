# Post-Task Checklist

After implementing any feature or making code changes, ALWAYS run:

1. **Build** — catches import/export errors:
   ```bash
   pnpm run build
   ```

2. **Type check** — catches TypeScript errors:
   ```bash
   pnpm run check-types
   ```

3. **Lint** — catches code style and potential bugs:
   ```bash
   pnpm run lint
   ```

4. **Unused code** — catches dead code:
   ```bash
   pnpm run knip
   ```

## Quick one-liner
```bash
pnpm run check-types && pnpm run lint && pnpm run knip
```

These checks also run automatically via Husky pre-commit hooks.
Fix all issues before committing.

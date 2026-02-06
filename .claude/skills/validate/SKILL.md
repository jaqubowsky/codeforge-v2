---
name: validate
description: Run post-feature validation checks on the codebase. Use when (1) user says /validate, "validate", "run checks", "verify build", "run validation", (2) after implementing any feature or code change, (3) before committing code, (4) when user wants to ensure nothing is broken. Runs build, type-check, lint, and unused code detection in sequence.
---

# Post-Feature Validation

Run all four validation steps in sequence, stopping on first failure:

```bash
pnpm run build && pnpm run check-types && pnpm run lint && pnpm run knip
```

## Execution

1. Run the command above
2. If any step fails, stop and report which step failed with the error output
3. If all steps pass, report success

## Output Format

On success:
```
All checks passed:
  - build
  - check-types
  - lint
  - knip
```

On failure, report the failing step and its error output so the user can fix it. Do NOT continue to subsequent steps after a failure.

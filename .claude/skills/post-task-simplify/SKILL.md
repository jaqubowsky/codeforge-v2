---
name: post-task-simplify
description: Automatically run the code-simplifier agent on recently modified code after completing any implementation task. This skill should be triggered at the end of any feature development, bug fix, refactoring, code migration, or similar coding task — essentially whenever code has been written or modified as part of the current conversation. It should NOT be triggered for research-only tasks, documentation questions, or conversations where no code was changed.
---

# Post-Task Code Simplification

After completing a coding task (feature, bug fix, refactoring, migration, etc.), run the `code-simplifier:code-simplifier` subagent via the Task tool on all files modified during the current session.

## When to Run

Run this at the END of any task that involved writing or modifying code:
- Feature implementation
- Bug fixes
- Refactoring
- Code migrations
- Adding tests
- Any PR-ready code changes

Do NOT run for:
- Research / exploration only
- Answering questions without code changes
- Reading files without modifications

## How to Run

1. Identify all files created or modified during the current conversation
2. Launch the `code-simplifier:code-simplifier` subagent via the Task tool with:
   - The list of modified file paths
   - Project conventions from CLAUDE.md (no comments, no `any`, `import type`, no enums, early returns, no `as` assertions)
   - Instruction to run the relevant package tests after simplifying to verify nothing broke

## Example Prompt for the Subagent

```
Simplify and refine the recently modified files for clarity, consistency, and maintainability while preserving all functionality. Focus on these files:

1. /path/to/file1.ts - [brief description of change]
2. /path/to/file2.ts - [brief description of change]

Project conventions:
- No code comments (self-documenting code preferred)
- Prefer `unknown` over `any`
- Use `import type` for types only
- No enums—use const objects or union types
- Early returns over nested conditionals
- No type assertions (`as`) — use Zod `.parse()`, typed variables, or explicit return type annotations
- Use explicit return type annotations to narrow literals instead of `as const`

After simplifying, run tests to ensure nothing broke.
```

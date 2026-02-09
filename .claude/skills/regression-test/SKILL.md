---
name: regression-test
description: Create regression tests for reported bugs to prevent them from recurring. Use when (1) user reports a bug and asks to write tests, (2) user says "write regression test", "add test for this bug", "make sure this never happens again", "test this fix", (3) after fixing a bug to ensure it stays fixed, (4) user describes a scenario that broke and wants test coverage.
---

# Regression Test Creator

Create focused regression tests that reproduce reported bugs and verify fixes.

## Process

1. **Understand the bug** - Identify the exact failure scenario, inputs, and expected vs actual behavior
2. **Locate the failing code** - Find the source file(s) where the bug occurs
3. **Find existing tests** - Check for existing test files in the same package/feature using `**/*.test.ts` glob
4. **Write the test** - Create a test that:
   - Reproduces the exact bug scenario (the test would FAIL before the fix)
   - Verifies the correct behavior after the fix
   - Covers edge cases related to the same bug class
5. **Run the test** - Execute with `pnpm run test` or package-specific `pnpm --filter <package> test`
6. **Verify the fix** - Confirm all tests pass

## Test Structure

Follow existing test patterns in the codebase:
- Use `vitest` (`describe`, `it`, `expect`, `vi`)
- Co-locate test files next to the source: `my-module.ts` → `my-module.test.ts`
- Use `vi.mock()` for external dependencies
- Use `afterEach(() => vi.clearAllMocks())` for mock isolation
- Name tests descriptively: `it("does not crash when timestamp is zero")`

## Test Naming Convention

Name describe blocks after the class/function being tested. Name test cases after the specific bug scenario:

```typescript
describe("ComponentName", () => {
  describe("bug scenario description", () => {
    it("specific regression case", () => { ... });
  });
});
```

## Key Principles

- Each regression test must target the exact scenario that caused the bug
- Include edge cases from the same bug class (e.g., if `0` caused a crash, also test `NaN`, `Infinity`, `null`)
- Mock external dependencies to isolate the unit under test
- Keep tests focused - one bug scenario per test case
- Test the fix, not the implementation details

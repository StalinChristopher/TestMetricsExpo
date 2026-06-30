# Design tokens

## Figma update workflow

1. Export or replace `design.tokens` from Figma.
2. Run `npm run generate:tokens` from the template root.
3. If the script reports semantic mapping errors, update **only** `semantic-colors.json` (not screens or `buildAppColors.ts`).
4. Smoke-test theme in Settings: light, dark, and system.

## Files

| File | Purpose |
|------|---------|
| `design.tokens` | Raw Figma export (light + dark color and sizing tokens) |
| `semantic-colors.json` | Maps app semantic names (`text1`, `primary`, …) to Figma `ColorToken` keys |

Generated output lives in `src/designSystem/generated/`.

## UI conventions

- Use **`AppText`**, **`AppButton`**, **`AppList`**, and **`AppTextInput`** (`src/components/`) for screen copy, actions, lists, and text fields — not raw `Text`, `FlatList`, or `TextInput`.
- Use generated tokens for spacing, font sizes, and border radii; use `useThemedStyles` for semantic colors.
- See repo `design_system_refactor.md` for migration examples.

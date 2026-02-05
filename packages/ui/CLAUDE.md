# UI Package - CLAUDE.md

Shared React component library built on shadcn/ui (Radix primitives) with Tailwind CSS v4 and OKLch color theming.

## Commands

```bash
pnpm check-types  # TypeScript validation
```

**No build step** - ESM-only, exports map to source files. Next.js transpiles directly via `transpilePackages`.

## Package Structure

```
src/
├── components/ui/         # All UI components
│   ├── alert-dialog.tsx
│   ├── badge.tsx          # Extended with semantic variants
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── combobox.tsx       # CUSTOM: multi-select with search
│   ├── confirm-button.tsx # CUSTOM: async confirmation wrapper
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── slider.tsx
│   ├── sonner.tsx         # CUSTOM: theme-aware toast notifications
│   ├── textarea.tsx
│   ├── tooltip.tsx
│   └── tooltip-wrapper.tsx # CUSTOM: convenience tooltip wrapper
├── lib/
│   └── utils.ts           # cn() utility (clsx + tailwind-merge)
└── styles/
    └── globals.css        # Theme variables (OKLch) + tailwind imports
```

## Import Pattern

```typescript
import { Button } from "@codeforge-v2/ui/components/button";
import { Badge } from "@codeforge-v2/ui/components/badge";
import { cn } from "@codeforge-v2/ui/lib/utils";
```

Always import from specific component files - no barrel exports from `components/ui`.

## Custom Components (Not from shadcn)

### Combobox
Multi-select dropdown with search and optional item creation.
- Props: `options`, `value`, `onChange`, `placeholder`, `creatable`
- Built on Radix Popover + cmdk

### ConfirmButton
Wraps content in AlertDialog with async confirmation handling.
- Props: `title`, `description`, `onConfirm`, `variant`, `disabled`
- Shows loading state during async operations

### Sonner (Toaster)
Theme-aware toast notifications using `sonner` + `next-themes`.

### TooltipWrapper
Convenience wrapper around Radix Tooltip primitives.
- Props: `children`, `content`, `delayDuration`, `side`, `className`

## Extended Components

### Badge Variants
```
default | secondary | destructive | outline | success | warning | info | remote | hybrid | office
```

### Button Variants
`default | destructive | outline | secondary | ghost | link`

### Button Sizes
`default | sm | lg | icon`

## Theme System

- **Color space**: OKLch (perceptually uniform)
- **CSS variables** defined in `globals.css` (light + dark themes via `.dark` class)
- **Key tokens**: `--primary`, `--destructive`, `--success`, `--warning`, `--info`, `--background`, `--foreground`
- All components use `data-slot` attributes for DOM identification

## Shadcn CLI Config

- Style: "new-york"
- RSC: disabled
- Icon library: lucide-react
- Tailwind CSS variables: enabled

## Dependencies

**Runtime**: Radix UI primitives, class-variance-authority, clsx, cmdk, lucide-react, next-themes, sonner, tailwind-merge, tw-animate-css

**Peer**: react 19+, react-dom 19+, tailwindcss 4+, postcss 8+

## Adding New Components

```bash
# From packages/ui directory:
npx shadcn@latest add [component-name]
```

Components land in `src/components/ui/`. Update `package.json` exports if adding a new file.

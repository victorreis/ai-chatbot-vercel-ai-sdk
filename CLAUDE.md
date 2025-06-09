# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Chatbot application built with Next.js 15, React 19, Tailwind 4, Shadcn UI and TypeScript. The project has a complete UI shell with mock data and is ready for Vercel AI SDK integration.

## Tech Stack

- **Next.js 15.3.3**: App Router with server actions enabled
- **React 19.1.0**: Latest React version
- **TypeScript 5.x**: Strict mode with comprehensive type checking
- **Tailwind CSS 4 (alpha)**: Using CSS variables for theming
- **Shadcn UI**: Component library with New York theme
- **Radix UI**: Accessible component primitives
- **@t3-oss/env-nextjs**: Environment variable validation
- **Jest + React Testing Library**: Testing framework (configured)
- **Storybook 9**: Component documentation
- **ESLint 9**: Flat config with extensive plugins
- **Prettier**: Code formatting with Tailwind plugin

## Commands

### Available Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
npm run typecheck    # Run TypeScript type checking
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run storybook    # Start Storybook dev server
npm run build-storybook # Build Storybook for production
```

### Git Hooks (via Husky)

- Pre-commit: Runs lint-staged (formats and lints changed files)
- Commit-msg: Validates commit message format (conventional commits)

## Project Structure

```
/app                # Next.js App Router pages
  /chat             # Main chat page
  /globals.css      # Global styles with Tailwind directives
  /layout.tsx       # Root layout with providers

/src                # Source code separated from app router
  /components       # React components
    /ui             # Shadcn UI components
    /ComponentName1 # Feature components
  /types            # TypeScript type definitions
  /utils            # Utility functions
  /mock-data.ts     # Mock chat data
  /env.mjs          # Environment configuration with validation
```

## File Organization Convention (IMPORTANT)

From now on, all new files must follow this structure:

### Components

```text
src/components/ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.test.tsx
  ├── ComponentName.stories.tsx
  ├── ComponentName.examples.tsx (optional)
  └── index.ts
```

### Utilities

```text
src/utils/UtilName/
  ├── UtilName.utils.ts
  ├── UtilName.test.ts
  └── index.ts
```

### Services

```text
src/services/ServiceName/
  ├── ServiceName.service.ts
  ├── ServiceName.service.test.ts
  └── index.ts
```

**Key Points:**

- Each module has its own folder with the same name
- The `index.ts` file exports the main functionality
- Test files are co-located with source files
- This structure ensures better organization and scalability

## Current Implementation Status

### Completed Features

- ✅ Basic chat UI with sidebar and message area
- ✅ Chat history display grouped by date
- ✅ File upload UI (PDF and images)
- ✅ Theme switching (light/dark/system)
- ✅ Responsive design
- ✅ Mock data structure for development
- ✅ TypeScript strict mode configuration
- ✅ ESLint and Prettier setup
- ✅ Git hooks with conventional commits
- ✅ Environment variable validation

### Pending Implementation

- ❌ Vercel AI SDK integration
- ❌ OpenAI API connection
- ❌ Server Actions for AI interactions
- ❌ PII detection tools
- ❌ Vercel KV for chat persistence
- ❌ Authentication (Vercel Auth)
- ❌ Real-time streaming responses
- ❌ Error boundaries and loading states
- ❌ Actual file processing for uploads
- ❌ Test coverage

## Development Guidelines

### Component Development

- All components must use TypeScript with proper interfaces
- Use `"use client"` directive only when necessary
- Implement proper error boundaries for AI interactions
- Support both controlled and uncontrolled patterns where applicable
- Use CVA (Class Variance Authority) for component variants
- Accessibility is mandatory (proper ARIA labels, keyboard navigation)

### Styling Guidelines

- Use Tailwind CSS 4 utilities exclusively
- Follow the CSS variable system for theming
- Never create tailwind.config.ts (Tailwind 4 uses CSS)
- Use `cn()` utility for conditional classes
- Maintain consistent spacing using Tailwind's scale

### State Management

- Local state with React hooks for UI
- Server state for AI responses (future)
- Form state with controlled components
- Chat history will be persisted in Vercel KV (future)

### TypeScript Conventions

- Enable all strict checks
- Define interfaces for all props and data structures
- Use `type` imports for type-only imports
- Prefer interfaces over types for object shapes
- Use proper generics where applicable

### Import Order (Enforced by ESLint)

1. External packages
2. Internal modules with @/ alias
3. Relative imports
4. Type imports last

### Testing Strategy

- Unit tests for utilities and services
- Component tests with React Testing Library
- Integration tests for AI interactions (future)
- Storybook for component documentation
- Aim for 80% code coverage minimum

## AI Integration Plan

When implementing Vercel AI SDK:

1. Use streaming responses for real-time updates
1. Implement proper error handling with fallbacks
1. Add loading states during AI processing
1. Support file attachments in messages
1. Implement PII detection as a separate tool

## Environment Variables

Required variables (to be added to `.env.local`):

```env
# OpenAI
OPENAI_API_KEY=

# Vercel KV (future)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Auth (future)
AUTH_SECRET=
```

## Important Reminders

### Code Quality

- **ALWAYS** run `npm run lint:fix` after making changes
- Ensure TypeScript has no errors with `npm run typecheck`
- Format code with `npm run format`
- Write tests for new functionality
- Use meaningful commit messages (conventional commits)
- **NEVER** create a redundant comment that says the same as the variable/function/class name, like

```typescript
// Card styles
export const cardStyles = "";
```

### File Management

- **NEVER** create `src/lib` directory
- **NEVER** create tailwind.config.ts (use Tailwind 4 CSS approach)
- **NEVER** create documentation unless explicitly requested
- Follow the new file structure convention for all new files

### Component Best Practices

- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement proper loading and error states
- Consider performance (memo, useMemo, useCallback)
- **NEVER** put `suppressHydrationWarning` on the html tag. In case it is needed, put it in the most nearest parent tag.

### Git Workflow

- Make atomic commits with clear messages
- Use conventional commit format
- Run all checks before pushing
- Keep PRs focused and reviewable

## Next Steps

1. Implement Vercel AI SDK integration
2. Connect to OpenAI API
3. Add streaming chat responses
4. Implement chat persistence with Vercel KV
5. Add authentication
6. Build PII detection tools
7. Enhance error handling and loading states
8. Write comprehensive tests

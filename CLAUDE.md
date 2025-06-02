# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Chatbot application using Next.js 15 and planned to integrate Vercel AI SDK. The project is in early development stage with a comprehensive development plan outlined in README.md.

## Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run Next.js linter
```

### Planned Commands (not yet implemented)

```bash
npm run type-check   # TypeScript type checking
npm run format       # Prettier formatting
npm run test         # Run tests
```

## Architecture

### Current Structure

- **Next.js 15 App Router**: Using the `/app` directory for routing
- **React 19**: Latest React version with new features
- **TypeScript**: Strict mode enabled with path alias `@/*`
- **Tailwind CSS 4**: Alpha version with CSS variables for theming
- **Environment**: Requires Node.js (preference for v22.x)

### Planned Architecture

1. **AI Integration**: Vercel AI SDK with OpenAI for chat functionality
2. **Storage**: Vercel KV for chat history persistence
3. **Authentication**: Vercel Auth for user management
4. **UI Components**: Shadcn UI library
5. **Code Structure**: Atomic Design pattern with separation of `/app` and `/src`

### Key Design Decisions

- Chat interface with navigation sidebar (left) and chat area (right)
- File upload support for PDFs and images
- PII (Personal Identifiable Information) detection via AI tools
- Loading states for AI processing and tool execution
- Chat history grouped by date

## Development Guidelines

### Component Development

- Follow the planned Atomic Design structure when creating components
- Use Server Actions for AI interactions
- Implement proper loading and error states
- Support file uploads with validation

### AI Integration Points

- Server Actions will handle OpenAI API calls via Vercel AI SDK
- Tools for PII extraction need to be implemented
- File attachments should be processed and sent with messages
- Error handling for API failures and invalid inputs

### State Management

- Chat history will be persisted in Vercel KV
- Local state for UI interactions
- Server state for AI responses and tool executions

## Environment Setup

- Copy `.env.example` to `.env.local`
- Required environment variables will include:
  - OpenAI API key
  - Vercel KV credentials
  - Auth provider configuration

## Development Plan Progress

The README.md contains a detailed checklist of features to implement. Key priorities:

1. Basic chat interface components
2. Vercel AI SDK integration
3. File upload functionality
4. PII detection tools
5. Authentication and storage

## Important Notes

- The project uses Tailwind CSS 4 (alpha) which has different configuration than v3
- CSS variables are used for theming (light/dark mode support)
- Geist fonts are configured as the default typography
- The codebase follows clean code principles: SOLID, KISS, YAGNI, DRY

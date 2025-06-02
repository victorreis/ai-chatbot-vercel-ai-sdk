# AI Chatbot Vercel AI SDK

A simple and intuitive Next app for a chatbot that uses Vercel AI SDK to make the chat interactive.

Check it Live here:
[https://ai-chatbot-vercel-ai-sdk.vercel.app/](https://ai-chatbot-vercel-ai-sdk.vercel.app/)

## Summary

- [Main features](#main-features)
- [Project objective](#project-objective)
- [Architecture decisions](#architecture-decisions)
- [Design decisions](#design-decisions)
- [Development plan](#development-plan)
- [Setup](#setup)
- [Running](#running)
- [Other scripts](#other-scripts)

## Main features

- Chat interface with file upload feature (using Vercel AI SDK)
- Identify PII (Personal Identifiable Information) in the uploaded file
- Indicate when a tool action is been executed
- Loading states during AI processing
- Error handling in the chat interface
- Navigation bar with chat history grouped by date
<!-- - GitHub and Google authentication (using Vercel auth) -->
<!-- - Store chat history per user (using Vercel KV) -->

## Project objective

The main objective of this project is to show some development skills through some technologies and concepts:

- Vercel AI SDK
- Next.js 15
- React 19
- React Hooks
- TypeScript
- Tailwind 4
- Shadcn UI
<!-- - Vercel KV -->
<!-- - Vercel Auth -->
<!-- - Unity tests (Jest + React Testing Library) -->
<!-- - Linters (eslint, style-lint, lint-staged) -->
<!-- - Formatters (editorconfig, prettier) -->
<!-- - git hooks (husky: pre-commit, prepare-commit-message) -->
<!-- - conventional-commits (commitizen) -->
<!-- - Scaffolding (scaffdog) -->
- Environment config (.vscode/\*, .npmrc, .nvmrc, etc)
<!-- - Thematization -->
- Usability
- Responsivity
- Clean Code
- SOLID
- KISS: “Keep It Simple, Stupid!”
- YAGNI: “You Ain’t gonna need it”
- DRY: “Do not Repeat Yourself”

## Architecture decisions

- Started with the basic template from Next.js
- Kept `/app` separated from `/src` to keep the app structure clean
- Used Shadcn UI + Tailwind CSS for the UI components for a fast development
<!-- - Used Atomic Design folder structure for the components -->
- Used Vercel AI SDK for AI processing
<!-- - Used Vercel KV and Vercel Auth for storage and authentication to do not depend on external services -->

## Design decisions

- Simple start layout with only the chat interface centered, that will evolve to a navigation bar on the left and a chat interface on the right.
- Chat interface with a textarea to type the message, a button to upload a file and a button to send the message, and the chat messages history.
- Chat messages will be displayed in a list with the user message in a gray color and the AI message in a blue color.
- Chat messages will be displayed with the text, the user name anda timestamp.
- Chat messages will be displayed with a loading state while the AI is processing the message.
- In case a tool is been executed, the chat message will highlight the tool name.
- The AI responses are streamed and displayed in real-time
- Navigation bar with the title and a chat history grouped by date, that will start with "Guest chat" selected by default. This navigation bar will allow adding more featured in the future, like authentication, chat history, etc.

## Development plan

- [x] Clone the basic template from Next.js
- [x] Organize the project README.md with the project development plan
- [ ] Improve the basic config files for better code quality control
- [ ] Create a chat interface page using Vercel AI SDK to make the chat interactive, with file upload feature
  - [ ] Create a chat message component
  - [ ] Create a chat textarea component
  - [ ] Create a chat messages history component
  - [ ] Create a chat file upload button component
- Implement the chat interactivity using Vercel AI SDK + OpenAI
  - [ ] Create a Server Action to send the user message with the file attachment and receive the AI generated text (using Vercel AI SDK for AI streaming + OpenAI)
  - [ ] Create a Tool in the Server Action to extract PII (Personal Identifiable Information)
  - [ ] Show appropriate loading states during AI processing
  - [ ] Display when tool actions are being executed (loading state)
  - [ ] Add Error handling in the chat interface when the user message is empty, a server/tool error occurs, when the file attachment is not a PDF or image, when the information in the image/PDF is not valid etc
- [ ] Create a navigation bar in the left portion of the screen with the title "AI Chatbot \[Vercel AI SDK\]" and a list of chat histories with "Guest chat" selected by default
  - [ ] Create a navigation bar component with a title
  - [ ] Create a navigation bar chat item component
  - [ ] Group chat items by date
- [ ] Use Vercel KV for storage
- [ ] Use Vercel Auth for authentication
- [ ] Add unit tests
- [ ] Add snapshot tests
- [ ] Add git hooks (pre-commit, pre-push) with husky
- [ ] Improve eslint/typescript rules
- [ ] Implement Atomic Design folder structure

## Setup

- Make sure that you have nodejs installed in you computer. Preference: node 22.x.
- Run `npm install`.
- Copy the `.env.example` file to `.env.local` and fill the values.

## Running

- Run `npm start`.

## Other scripts

- Typescript type check: `npm run type-check`
- Prettier formating: `npm run format`
- Linting code: `npm run lint`
- Build: `npm run build`
<!-- - Tests: `npm run test` -->
<!-- - Scaffolding: `npm run g` -->

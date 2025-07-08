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

- Chat interface with file upload feature (using Vercel AI SDK).
- Identify PII (Personal Identifiable Information) in the uploaded file.
- Indicate when a tool action is been executed.
- Loading states during AI processing.
- Error handling in the chat interface.
- Navigation bar with chat history grouped by date.
  <!-- - GitHub and Google authentication (using Vercel auth). -->
  <!-- - Store chat history per user (using Vercel KV). -->

## Project objective

The main objective of this project is to show some development skills through some technologies and concepts:

- Vercel AI SDK
- Next.js 15
- React 19
- React Hooks
- TypeScript
- Tailwind 4
- Shadcn UI
- Environment config (.vscode/\*, .npmrc, .nvmrc, etc)
- Linters (eslint)
- Formatters (editorconfig, prettier)
- Storybook
- Unit tests (Jest + React Testing Library)
- conventional-commits (commitlint)
- git hooks (husky: pre-commit, prepare-commit-message)
- Usability
- Responsivity
- Clean Code
- SOLID
- KISS: “Keep It Simple, Stupid!”
- YAGNI: “You Ain’t gonna need it”
- DRY: “Do not Repeat Yourself”
  <!-- - Vercel KV -->
  <!-- - Vercel Auth -->
  <!-- - Scaffolding (scaffdog) -->
  <!-- - Thematization -->

## Architecture decisions

- Started with the basic template from Next.js.
- Kept `/app` separated from `/src` to keep the app structure clean.
- Used Shadcn UI + Tailwind CSS for the UI components for a fast development.
- Used Vercel AI SDK for AI processing.
  <!-- - Used Atomic Design folder structure for the components. -->
  <!-- - Used Vercel KV and Vercel Auth for storage and authentication to do not depend on external services. -->

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

- [x] Learn about Vercel AI SDK. (2 hours)
- [x] Clone the basic template from Next.js. (1 min)
- [x] Organize the project README.md with the project development plan. (2 hours)
- [x] Improve the basic config files for better code quality control. (3 hours)
- [x] UI Development. (8 hours, I played a lot with the design, very fun!)
  - [x] Create a navigation bar in the left portion of the screen:
    - [x] Create a chat message component that differentiates between user and AI messages by background color.
    - [x] Create a chat messages history component that differentiates between user and AI messages by left/right alignment. It shows the timestamp.
    - [x] Create a chat textarea component with floating buttons for file upload and send.
    - [x] Create a chat bar on top of the screen with the chat title on the the right: the user name and the theme switcher.
    - [x] Implement auto-scroll to bottom when new messages are added.
  - [x] Create a chat interface page, with file upload feature on the right portion of it:
    - [x] Create a navigation bar component with the title "AI Chatbot".
    - [x] Create a "New Chat" button below the title.
    - [x] Create a list of chat titles below the "New Chat" button and group chat titles by date (Today, Yesterday, 2 days ago, etc).
    - [x] Create a dropdown menu for the chat titles list with the options to rename and delete the chat.
    - [x] Mock data for the chat messages history.
  - [x] Modern scrollbar styles
  - [x] Theme switcher (dark/light/system)
  - [x] AI model switcher (OpenAI/Gemini) (Gemini free version has limited capabilities)
- [x] Implement the chat interactivity using Vercel AI SDK + OpenAI. (6 hours)
  - [x] Create a Server Action to send the user message with the file attachment and receive the AI generated text (using Vercel AI SDK for AI streaming + OpenAI).
  - [x] Create a Tool in the Server Action to extract PII (Personal Identifiable Information).
  - [x] Show appropriate loading states during AI processing.
  - [x] Display when tool actions are being executed (loading state).
  - [x] Add Error handling in the chat interface when a server/tool error occurs, when the file attachment is not a PDF or image, when the information in the image/PDF is not valid etc.
- [ ] Use Vercel KV for storage.
- [ ] Use Vercel Auth for authentication.
- [ ] Add unit tests.
- [ ] Add snapshot tests.
- [ ] Implement Atomic Design folder structure.

## Setup

- Make sure that you have nodejs installed in you computer. Preference: node 22.x.
- Run `npm install`.
- Copy the `.env.example` file to `.env.local` and fill the values.

## Running

- Run `npm start`.

## Other scripts

- Typescript type check: `npm run type-check`.
- Prettier formating: `npm run format`.
- Linting code: `npm run lint`.
- Build: `npm run build`.
  <!-- - Tests: `npm run test`. -->
  <!-- - Scaffolding: `npm run g`. -->

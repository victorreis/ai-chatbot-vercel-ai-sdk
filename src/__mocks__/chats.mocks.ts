import type { Chat } from "../types/chat";

export const mockChats: Chat[] = [
  // Today - Just now
  {
    id: "chat-1",
    title: "NextAuth.js Implementation Help test long title",
    timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    messages: [
      {
        id: "msg-1",
        content:
          "I need help understanding how to implement authentication in Next.js 15.",
        role: "user",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        attachments: [
          {
            name: "auth-requirements.pdf",
            type: "application/pdf",
            size: 245_000,
          },
        ],
      },
      {
        id: "msg-2",
        content:
          "I'll help you with authentication in Next.js 15! Based on your requirements, I recommend using NextAuth.js. Would you like me to show you a basic setup?",
        role: "assistant",
        timestamp: new Date(Date.now() - 4 * 60 * 1000),
      },
      {
        id: "msg-3",
        content: "Yes, please show me the basic setup!",
        role: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: "msg-4",
        content:
          'Here\'s a basic NextAuth.js setup for Next.js 15:\n\n```typescript\n// app/api/auth/[...nextauth]/route.ts\nimport NextAuth from "next-auth"\nimport GoogleProvider from "next-auth/providers/google"\n\nconst handler = NextAuth({\n  providers: [\n    GoogleProvider({\n      clientId: process.env.GOOGLE_CLIENT_ID!,\n      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n    })\n  ],\n})\n\nexport { handler as GET, handler as POST }\n```',
        role: "assistant",
        timestamp: new Date(Date.now() - 30 * 1000),
      },
    ],
  },
  // Today - 2 hours ago
  {
    id: "chat-2",
    title: "React 19 New Features",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-5",
        content: "What's new in React 19?",
        role: "user",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5 * 60 * 1000),
      },
      {
        id: "msg-6",
        content:
          "React 19 introduces several exciting features including the new use() hook, improved Server Components, and better suspense handling. The new use() hook is particularly interesting as it allows you to read resources like promises or context during render.",
        role: "assistant",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
  // Today - 8 hours ago
  {
    id: "chat-3",
    title: "Image Optimization Strategies",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-7",
        content: "How can I optimize my images for better performance?",
        role: "user",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000 - 10 * 60 * 1000),
      },
      {
        id: "msg-8",
        content:
          "Here are key strategies for image optimization:\n\n1. Use Next.js Image component for automatic optimization\n2. Serve images in modern formats (WebP, AVIF)\n3. Implement responsive images with srcset\n4. Compress images without losing quality\n5. Use lazy loading for below-the-fold images",
        role: "assistant",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ],
  },
  // Yesterday
  {
    id: "chat-4",
    title: "API Routes in App Router",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-9",
        content: "I need help with API routes in Next.js 15",
        role: "user",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 15 * 60 * 1000),
      },
      {
        id: "msg-10",
        content:
          "API routes in Next.js 15 App Router work differently. You need to create a route.ts file and export named functions for each HTTP method (GET, POST, etc.). Remember to export named functions for each HTTP method you want to handle.",
        role: "assistant",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 3 days ago
  {
    id: "chat-5",
    title: "SSR vs SSG Explained",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-11",
        content: "What is the difference between SSR and SSG?",
        role: "user",
        timestamp: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000,
        ),
      },
      {
        id: "msg-12",
        content:
          "SSR (Server-Side Rendering) generates HTML on each request, while SSG (Static Site Generation) pre-builds pages at build time. SSG is better for static content that doesn't change often, while SSR is ideal for dynamic content that needs to be fresh on every request.",
        role: "assistant",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 1 week ago
  {
    id: "chat-6",
    title: "Tailwind CSS Best Practices",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-13",
        content: "What are some Tailwind CSS best practices?",
        role: "user",
        timestamp: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000,
        ),
      },
      {
        id: "msg-14",
        content:
          "Here are key Tailwind CSS best practices:\n\n1. Use utility classes directly in your markup\n2. Use @apply sparingly, prefer utility classes\n3. Extract component classes for truly reusable components\n4. Use the official Prettier plugin for consistent formatting\n5. Leverage JIT mode for optimal performance",
        role: "assistant",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 2 weeks ago
  {
    id: "chat-7",
    title: "Deploying to Vercel",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-15",
        content: "How do I deploy my Next.js app to Vercel?",
        role: "user",
        timestamp: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000,
        ),
      },
      {
        id: "msg-16",
        content:
          "Deploying to Vercel is straightforward:\n\n1. Push your code to GitHub\n2. Import your repository in Vercel\n3. Configure build settings (usually automatic)\n4. Set environment variables\n5. Deploy! Don't forget to set your environment variables in the Vercel dashboard.",
        role: "assistant",
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 1 month ago
  {
    id: "chat-8",
    title: "React Hooks Deep Dive",
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-17",
        content: "Can you explain React hooks in detail?",
        role: "user",
        timestamp: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000,
        ),
      },
      {
        id: "msg-18",
        content:
          "React hooks allow you to use state and lifecycle features in functional components. Key hooks include useState for state management, useEffect for side effects, useContext for consuming context, and useCallback for memoizing functions. useCallback is particularly useful for preventing unnecessary re-renders.",
        role: "assistant",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 3 months ago
  {
    id: "chat-9",
    title: "TypeScript Configuration",
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-19",
        content: "What's the best TypeScript configuration for Next.js?",
        role: "user",
        timestamp: new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000,
        ),
      },
      {
        id: "msg-20",
        content:
          "For Next.js projects, I recommend enabling strict mode in your tsconfig.json for better type safety. Also configure path aliases, enable incremental compilation, and use the latest ECMAScript target your environment supports.",
        role: "assistant",
        timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 6 months ago
  {
    id: "chat-10",
    title: "Database Integration Options",
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-21",
        content: "What are good database options for Next.js?",
        role: "user",
        timestamp: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000,
        ),
      },
      {
        id: "msg-22",
        content:
          "Popular database options for Next.js include PostgreSQL with Prisma ORM, MongoDB with Mongoose, and serverless options like PlanetScale or Neon. Prisma is particularly great for type-safe database access with excellent TypeScript support.",
        role: "assistant",
        timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 1 year ago
  {
    id: "chat-11",
    title: "Getting Started with Next.js",
    timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-23",
        content: "I'm new to Next.js. Where should I start?",
        role: "user",
        timestamp: new Date(
          Date.now() - 365 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000,
        ),
      },
      {
        id: "msg-24",
        content:
          "Welcome to Next.js! Start with create-next-app for the best experience. It sets up everything you need including TypeScript, ESLint, and Tailwind CSS. Then explore the App Router, which is the modern way to build Next.js applications.",
        role: "assistant",
        timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  // 2 years ago
  {
    id: "chat-12",
    title: "React Basics",
    timestamp: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-25",
        content: "What is React and why should I use it?",
        role: "user",
        timestamp: new Date(
          Date.now() - 730 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000,
        ),
      },
      {
        id: "msg-26",
        content:
          "React is a JavaScript library for building user interfaces. It uses a component-based architecture where components are the building blocks of React apps. React's virtual DOM, declarative syntax, and large ecosystem make it a popular choice for modern web development.",
        role: "assistant",
        timestamp: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

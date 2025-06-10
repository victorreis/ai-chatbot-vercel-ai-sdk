import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { env } from "@/env.mjs";
import { devError, devLog } from "@/utils/env";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      experimental_attachments: z
        .array(
          z.object({
            url: z.string(),
            pathname: z.string(),
            contentType: z.string(),
          }),
        )
        .optional(),
    }),
  ),
  model: z.string().optional().default("gemini-2.0-flash"),
});

// Store messages in a variable accessible to the tool
let currentMessages: z.infer<typeof ChatRequestSchema>["messages"] = [];

const piiDetectionTool = {
  description:
    "Detects Personal Identifiable Information (PII) in file attachments provided by the user",
  parameters: z.object({
    attachmentIndex: z
      .number()
      .min(1)
      .describe(
        "The index of the attachment in the user's message to analyze (0-based)",
      ),
  }),
  execute: async ({ attachmentIndex }: { attachmentIndex: number }) => {
    // Find the last user message with attachments
    const userMessages = currentMessages.filter(
      (m) =>
        m.role === "user" &&
        m.experimental_attachments &&
        m.experimental_attachments.length > 0,
    );
    const lastUserMessage = userMessages.at(-1);

    if (!lastUserMessage || !lastUserMessage.experimental_attachments) {
      return {
        error: "No attachments found in the user's message",
      };
    }

    const attachment =
      lastUserMessage.experimental_attachments[attachmentIndex];
    if (!attachment) {
      return {
        error: `No attachment found at index ${attachmentIndex}`,
      };
    }

    const { pathname: fileName, contentType: fileType } = attachment;
    devLog("PII Detection Tool executing", {
      fileName,
      fileType,
      attachmentIndex,
    });

    // In a real implementation, you would process the actual file content
    // For now, we'll analyze the message content as a placeholder
    const fileContent = lastUserMessage.content;

    const piiPatterns = {
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      creditCard: /\b(?:\d[ -]*?){13,19}\b/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      dateOfBirth: /\b(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})\b/g,
      passport: /\b[A-Z]{1,2}\d{6,9}\b/g,
      driverLicense: /\b[A-Z]{1,2}\d{5,8}\b/g,
    };

    const detectedPII: Record<string, string[]> = {};

    for (const [type, pattern] of Object.entries(piiPatterns)) {
      const matches = fileContent.match(pattern);
      if (matches && matches.length > 0) {
        detectedPII[type] = [...new Set(matches)];
      }
    }

    const hasPII = Object.keys(detectedPII).length > 0;

    devLog("PII Detection results", {
      fileName,
      hasPII,
      types: Object.keys(detectedPII),
    });

    return {
      fileName,
      fileType,
      hasPII,
      detectedPII,
      summary: hasPII
        ? `Found PII in ${fileName}: ${Object.keys(detectedPII).join(", ")}`
        : `No PII detected in ${fileName}`,
    };
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    devLog("Chat request received", { messageCount: body.messages?.length });
    devLog("Request body:", JSON.stringify(body, null, 2));

    // Ensure all messages have IDs before validation
    const bodyWithIds = {
      ...body,
      messages: body.messages?.map(
        (msg: { id?: string; [key: string]: unknown }, index: number) => ({
          ...msg,
          id:
            msg.id ||
            `msg-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 11)}`,
        }),
      ),
    };

    const validatedData = ChatRequestSchema.parse(bodyWithIds);
    const { messages, model } = validatedData;

    // Store messages for tool access (will be updated with system message later)
    currentMessages = messages;

    devLog("Using model:", model);

    // Determine which provider to use based on the model
    const isOpenAI = model.startsWith("gpt");
    const isGoogle = model.startsWith("gemini");

    // Check if the required API key is available
    if (isOpenAI && !env.OPENAI_API_KEY) {
      devError("OpenAI API key not configured");
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    if (isGoogle && !env.GEMINI_API_KEY) {
      devError("Gemini API key not configured");
      return new Response("Gemini API key not configured", { status: 500 });
    }

    if (!isOpenAI && !isGoogle) {
      devError("Invalid model:", model);
      return new Response("Invalid model specified", { status: 400 });
    }
    devLog(
      "Message details:",
      messages.map((m) => ({
        id: m.id,
        role: m.role,
        hasAttachments: !!(
          m.experimental_attachments && m.experimental_attachments.length > 0
        ),
        attachmentCount: m.experimental_attachments?.length || 0,
        attachments: m.experimental_attachments,
      })),
    );

    // Check if the last message has attachments
    const lastMessage = messages.at(-1);
    const hasAttachments =
      lastMessage?.experimental_attachments &&
      lastMessage.experimental_attachments.length > 0;

    // Add system message if there are attachments
    const messagesWithSystem = hasAttachments
      ? [
          {
            id: "system-pii",
            role: "system" as const,
            content:
              "When the user provides file attachments, analyze them for Personal Identifiable Information (PII) using the detectPII tool. Call the tool with attachmentIndex starting from 0 for each attachment.",
          },
          ...messages,
        ]
      : messages;

    // Update currentMessages for tool access
    currentMessages = messagesWithSystem;

    // Set the API key via environment variable for Google
    if (isGoogle) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = env.GEMINI_API_KEY;
    }

    // Select the appropriate model based on the provider
    const aiModel = isOpenAI ? openai(model) : google(model);

    const result = streamText({
      model: aiModel,
      messages: messagesWithSystem,
      maxSteps: 5,
      tools: {
        detectPII: piiDetectionTool,
      },
      onFinish: async ({ usage, finishReason }) => {
        devLog("Stream finished", { usage, finishReason });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    devError("Chat API error:", error);

    // Log the full error details
    if (error instanceof Error) {
      devError("Error name:", error.name);
      devError("Error message:", error.message);
      devError("Error stack:", error.stack);
    }

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (error instanceof Error) {
      // Return more detailed error message in development
      const errorMessage =
        env.NODE_ENV === "development"
          ? `${error.name}: ${error.message}`
          : "An error occurred";

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

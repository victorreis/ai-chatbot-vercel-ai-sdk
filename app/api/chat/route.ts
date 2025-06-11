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

// PII Detection Tool with AI-powered analysis

const piiDetectionTool = {
  description:
    "Analyzes file attachments for Personal Identifiable Information (PII) using AI vision and text analysis",
  parameters: z.object({
    attachmentIndex: z
      .number()
      .min(0)
      .describe(
        "The index of the attachment in the user's message to analyze (0-based, starting from 0)",
      ),
  }),
  execute: async ({ attachmentIndex }: { attachmentIndex: number }) => {
    try {
      devLog("PII Detection Tool called with index:", attachmentIndex);

      return {
        fileName: `attachment-${attachmentIndex}`,
        fileType: "image/document",
        summary: `Please examine the uploaded file at index ${attachmentIndex} visually for PII detection. Look for names, email addresses, phone numbers, addresses, dates of birth, and other personally identifiable information.`,
        instructions: `ANALYZE THIS FILE FOR PII:

**PERSONAL IDENTIFIERS** (ALWAYS PII):
- Any person's full name, first name, last name
- Email addresses (personal or professional)  
- Phone numbers (any format)
- Physical addresses (home, work, or mailing)
- Dates of birth or age information

**SENSITIVE IDENTIFIERS**:
- Social Security Numbers
- Driver's License Numbers
- Passport Numbers
- National ID Numbers
- Tax ID Numbers

**FINANCIAL INFORMATION**:
- Bank account numbers
- Credit/debit card numbers
- Financial transaction details

**DIGITAL IDENTIFIERS**:
- Login credentials
- IP addresses
- Device identifiers

**OTHER PII**:
- Medical information
- Employment details with personal context
- Vehicle registration numbers
- Any other personal identifiers

For EACH piece of PII found, provide:
1. **PII Category**: (e.g., "Full Name", "Email Address", "Phone Number")
2. **Value**: The actual value found
3. **Location**: Where it appears in the document

RESPOND IN THIS FORMAT:
## PII DETECTED:

**[Category]**: [Value] - Found in: [Location/Context]

If no PII is found, respond with "NO PII DETECTED".`,
      };
    } catch (error) {
      devError("Error in PII detection tool:", error);
      return {
        error: `PII detection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
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

    // Messages ready for processing

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

    // Add system message for file attachments
    const messagesWithSystem = hasAttachments
      ? [
          {
            id: "system-pii",
            role: "system" as const,
            content: `The user has uploaded file attachments. When asked to analyze files for PII:

1. FIRST use the detectPII tool with attachment index 0 to get PII detection instructions
2. THEN examine each uploaded image/document visually for all types of personally identifiable information
3. Look carefully for names, email addresses, phone numbers, addresses, SSNs, and other PII
4. Be thorough and strict - names and contact info in resumes/CVs ARE considered PII
5. List every piece of PII found with its category, value, and location in the document

The detectPII tool will provide detailed instructions on what to look for.`,
          },
          ...messages,
        ]
      : messages;

    // Messages prepared for AI processing

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
      onStepFinish: async ({ stepType, usage, finishReason }) => {
        devLog("Step finished", { stepType, usage, finishReason });
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

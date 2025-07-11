"use client";

import { Paperclip, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

// Message styles
const messageStyles = {
  container: "flex gap-3",
  wrapper: "flex max-w-[70%] flex-col gap-2",
  base: "rounded-lg px-4 py-3 shadow-sm transition-all duration-200",
  user: {
    container: "justify-end",
    wrapper: "items-end",
    bubble: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
  },
  assistant: {
    container: "justify-start",
    wrapper: "items-start",
    bubble:
      "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50",
  },
  text: "text-sm leading-relaxed whitespace-pre-wrap",
  time: "text-muted-foreground text-xs",
  attachment:
    "bg-background/50 text-muted-foreground border-border/50 rounded-full border px-3 py-1 text-xs backdrop-blur-sm",
} as const;

interface Attachment {
  name: string;
  type: string;
  size: number;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: Attachment[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [timeString, setTimeString] = useState<string>("");

  // Check if message content contains tool usage indicators
  const hasToolUsage =
    !isUser &&
    (message.content.includes("detectPII") ||
      message.content.includes("PII Detection Tool") ||
      message.content.includes("## PII DETECTED:") ||
      message.content.toLowerCase().includes("processing file") ||
      message.content.toLowerCase().includes("analyzing") ||
      message.content.toLowerCase().includes("pii analysis"));

  // Format time on client side only to avoid hydration mismatches
  useEffect(() => {
    setTimeString(
      message.timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [message.timestamp]);

  return (
    <div
      className={cn(
        messageStyles.container,
        isUser
          ? messageStyles.user.container
          : messageStyles.assistant.container,
      )}
    >
      <div
        className={cn(
          messageStyles.wrapper,
          isUser ? messageStyles.user.wrapper : messageStyles.assistant.wrapper,
        )}
      >
        <div
          className={cn(
            messageStyles.base,
            isUser
              ? "message-user border-0" // Still using CSS class for gradient
              : "message-assistant border",
          )}
        >
          {hasToolUsage && (
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                <Wrench className="h-3 w-3" />
                <span>PII Detection Tool Used</span>
              </div>
            </div>
          )}
          <p className={messageStyles.text}>{message.content}</p>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.attachments.map((attachment, index) => (
              <span
                className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs"
                key={index}
              >
                <Paperclip className="h-3 w-3" />
                {attachment.name}
              </span>
            ))}
          </div>
        )}

        <span className={messageStyles.time}>{timeString || "..."}</span>
      </div>
    </div>
  );
}

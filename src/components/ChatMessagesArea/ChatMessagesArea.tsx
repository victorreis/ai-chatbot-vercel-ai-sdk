"use client";

import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useRef } from "react";

import { ChatMessage } from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types/chat";

interface ChatMessagesAreaProps {
  messages: Message[];
  status:
    | "streaming"
    | "awaiting_message"
    | "in_progress"
    | "error"
    | "submitted"
    | "ready";
  isProcessingTool: boolean;
  isSubmitting: boolean;
  error: Error | undefined;
  onRetry: () => void;
}

export const ChatMessagesArea = forwardRef<
  HTMLDivElement,
  ChatMessagesAreaProps
>(
  (
    { messages, status, isProcessingTool, isSubmitting, error, onRetry },
    ref,
  ) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
      if (messagesEndRef.current && ref && "current" in ref && ref.current) {
        const scrollContainer = ref.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    }, [messages.length, status, isSubmitting, ref]);

    return (
      <ScrollArea className="flex-1" ref={ref}>
        <div className="p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isSubmitting && status !== "streaming" && (
              <div className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Sending message...</span>
              </div>
            )}
            {status === "streaming" && (
              <div className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  {isProcessingTool
                    ? "Processing file with PII detection..."
                    : "AI is thinking..."}
                </span>
              </div>
            )}
            {error && (
              <div className="text-destructive bg-destructive/10 rounded-md p-3 text-sm">
                Error: {error.message}
                <Button
                  className="ml-2"
                  onClick={onRetry}
                  size="sm"
                  variant="ghost"
                >
                  Retry
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
    );
  },
);

ChatMessagesArea.displayName = "ChatMessagesArea";

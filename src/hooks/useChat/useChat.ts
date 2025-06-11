import { useChat as useAIChat } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Chat, Message } from "@/types/chat";

interface UseChatProps {
  selectedChatId: string;
  selectedModel: string;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export function useChat({
  selectedChatId,
  selectedModel,
  chats,
  setChats,
}: UseChatProps) {
  const [isProcessingTool, setIsProcessingTool] = useState(false);

  const {
    messages: aiMessages,
    append,
    reload,
    status,
    error,
    setMessages: setAIMessages,
  } = useAIChat({
    id: selectedChatId,
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    generateId: () =>
      `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error(
        error.message || "An error occurred while processing your message",
      );
    },
    onFinish: () => {
      updateChatMessages();
    },
    onToolCall: ({ toolCall }) => {
      // eslint-disable-next-line no-console
      console.log("Tool called:", toolCall);
      setIsProcessingTool(true);
    },
  });

  // Use AI messages when available, otherwise fall back to local chat messages
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const displayMessages = (() => {
    if (aiMessages.length > 0) {
      // When AI messages exist, combine welcome message with AI messages
      const welcomeMessage = selectedChat?.messages.find((msg) =>
        msg.id.startsWith("welcome-"),
      );
      const aiMessagesMapped = aiMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        timestamp: new Date(msg.createdAt || Date.now()),
        attachments:
          msg.role === "user"
            ? msg.experimental_attachments?.map(
                (att: {
                  name?: string;
                  pathname?: string;
                  contentType?: string;
                  url?: string;
                }) => ({
                  name: att.name || att.pathname || "attachment",
                  type: att.contentType || "application/octet-stream",
                  size: 0,
                  url: att.url,
                }),
              )
            : undefined,
      }));

      // Include welcome message if it exists
      return welcomeMessage
        ? [welcomeMessage, ...aiMessagesMapped]
        : aiMessagesMapped;
    }

    // No AI messages, use local chat messages
    return selectedChat?.messages || [];
  })();

  // Sync AI messages with local chat state
  const updateChatMessages = useCallback(() => {
    if (!selectedChatId || aiMessages.length === 0) return;

    const formattedMessages: Message[] = aiMessages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      timestamp: new Date(msg.createdAt || Date.now()),
      attachments:
        msg.role === "user"
          ? msg.experimental_attachments?.map(
              (att: { name?: string; contentType?: string; url?: string }) => ({
                name: att.name || "attachment",
                type: att.contentType || "application/octet-stream",
                size: 0,
                url: att.url,
              }),
            )
          : undefined,
    }));

    setChats((prevChats) => {
      const existingChat = prevChats.find((chat) => chat.id === selectedChatId);
      if (existingChat) {
        // Preserve welcome message when updating with AI messages
        const welcomeMessage = existingChat.messages.find((msg) =>
          msg.id.startsWith("welcome-"),
        );
        const allMessages = welcomeMessage
          ? [welcomeMessage, ...formattedMessages]
          : formattedMessages;

        return prevChats.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, messages: allMessages, timestamp: new Date() }
            : chat,
        );
      } else {
        const newChat: Chat = {
          id: selectedChatId,
          title:
            formattedMessages[0]?.content.slice(0, 30) + "..." || "New Chat",
          timestamp: new Date(),
          messages: formattedMessages,
        };
        return [newChat, ...prevChats];
      }
    });
  }, [aiMessages, selectedChatId, setChats]);

  // Update chat messages when AI messages change
  useEffect(() => {
    updateChatMessages();
  }, [aiMessages, updateChatMessages]);

  // Reset tool processing state when not loading
  useEffect(() => {
    if (status !== "streaming") {
      setIsProcessingTool(false);
    }
  }, [status]);

  const sendMessage = async (
    content: string,
    attachments: Array<{ url: string; pathname: string; contentType: string }>,
  ) => {
    try {
      await append({
        content,
        role: "user",
        experimental_attachments: attachments,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    }
  };

  const clearMessages = () => {
    setAIMessages([]);
  };

  return {
    messages: displayMessages,
    sendMessage,
    reload,
    status,
    error,
    isProcessingTool,
    clearMessages,
  };
}

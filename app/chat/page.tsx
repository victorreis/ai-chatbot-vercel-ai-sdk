"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessagesArea } from "@/components/ChatMessagesArea";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useAvailableModels } from "@/hooks/useAvailableModels";
import { useChat } from "@/hooks/useChat";
import { layoutStyles } from "@/styles";
import type { Chat } from "@/types/chat";
import { cn } from "@/utils/cn";

const INITIAL_CHAT_MESSAGE =
  "Welcome! I can analyze your documents for personally identifiable information (PII). Upload a file or ask me anything to get started.";
export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Load from localStorage on initialization, fallback to default
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedModel") || "gpt-4-turbo";
    }
    return "gpt-4-turbo";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const username = "Guest User";

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { availableModels } = useAvailableModels();

  // Function to update model and persist to localStorage
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("selectedModel", modelId);
  };

  // Set default model when models are loaded
  useEffect(() => {
    if (
      availableModels.length > 0 &&
      !availableModels.some((m) => m.id === selectedModel)
    ) {
      const defaultModel = availableModels[0]!.id;
      handleModelChange(defaultModel);
    }
  }, [availableModels, selectedModel]);

  const {
    messages: displayMessages,
    sendMessage,
    reload,
    status,
    error,
    isProcessingTool,
    clearMessages,
  } = useChat({
    selectedChatId,
    selectedModel,
    chats,
    setChats,
  });

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Initialize with a default chat
  useEffect(() => {
    if (chats.length === 0) {
      const initialChat: Chat = {
        id: `chat-${Date.now()}`,
        title: "New Chat",
        timestamp: new Date(),
        messages: [
          {
            id: `welcome-${Date.now()}`,
            content: INITIAL_CHAT_MESSAGE,
            role: "assistant",
            timestamp: new Date(),
          },
        ],
      };
      setChats([initialChat]);
      setSelectedChatId(initialChat.id);
    }
  }, [chats.length]);

  const handleSendMessage = async () => {
    // Validate input
    if (!inputValue.trim() && attachedFiles.length === 0) {
      toast.error("Please enter a message or attach a file");
      return;
    }

    if (!selectedChatId) {
      toast.error("Please select or create a chat first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate file types
      const invalidFiles = attachedFiles.filter(
        (file) =>
          !file.type.startsWith("image/") && file.type !== "application/pdf",
      );

      if (invalidFiles.length > 0) {
        toast.error("Only PDF and image files are allowed");
        return;
      }

      // Convert files to attachments
      const attachments = await Promise.all(
        attachedFiles.map(async (file) => {
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          return {
            url: dataUrl,
            pathname: file.name,
            contentType: file.type,
          };
        }),
      );

      // Clear input immediately for better UX
      const messageContent =
        inputValue.trim() ||
        "Identify PIIs and separate by PII type, value and line where it was found.";
      setInputValue("");
      setAttachedFiles([]);

      // Send message with attachments
      await sendMessage(messageContent, attachments);
    } catch {
      // Input is already restored by the hook on error
      setInputValue(inputValue);
      setAttachedFiles(attachedFiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const fileArray = [...files];
    const validFiles = fileArray.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf",
    );

    if (validFiles.length < fileArray.length) {
      toast.error(
        "Some files were skipped. Only PDF and image files are allowed.",
      );
    }

    setAttachedFiles(validFiles);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      timestamp: new Date(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          content: INITIAL_CHAT_MESSAGE,
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    };
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
    clearMessages();
  };

  const handleChatRename = (chatId: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  const handleChatDelete = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

    if (selectedChatId === chatId) {
      const remainingChat = chats.find((chat) => chat.id !== chatId);
      setSelectedChatId(remainingChat?.id || "");
      clearMessages();
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    clearMessages();
  };

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <ChatSidebar
        chats={chats}
        onChatDelete={handleChatDelete}
        onChatRename={handleChatRename}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        selectedChatId={selectedChatId}
      />

      <main className={cn(layoutStyles.main, "bg-section-main")}>
        <ChatHeader
          availableModels={availableModels}
          onModelChange={handleModelChange}
          selectedModel={selectedModel}
          title={selectedChat?.title || "Select a chat"}
          username={username}
        />

        <ChatMessagesArea
          error={error}
          isProcessingTool={isProcessingTool}
          isSubmitting={isSubmitting}
          messages={displayMessages}
          onRetry={reload}
          ref={scrollAreaRef}
          status={status}
        />

        <ChatInput
          attachedFiles={attachedFiles}
          disabled={!inputValue.trim() && attachedFiles.length === 0}
          isLoading={status === "streaming" || isSubmitting}
          onChange={setInputValue}
          onFileSelect={handleFileSelect}
          onSubmit={handleSendMessage}
          value={inputValue}
        />
      </main>
    </div>
  );
}

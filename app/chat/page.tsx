"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, Plus, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatFileUploadButton } from "@/components/ChatFileUploadButton";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatTextarea } from "@/components/ChatTextarea";
import { ModelSelector } from "@/components/ModelSelector";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAvailableModels } from "@/hooks/useAvailableModels";
import { layoutStyles } from "@/styles";
import type { Chat, Message } from "@/types/chat";
import { cn } from "@/utils/cn";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isProcessingTool, setIsProcessingTool] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<string>("gemini-2.0-flash");
  const username = "Guest User";

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { availableModels } = useAvailableModels();

  // Set default model when models are loaded
  useEffect(() => {
    if (
      availableModels.length > 0 &&
      !availableModels.some((m) => m.id === selectedModel)
    ) {
      setSelectedModel(availableModels[0]!.id);
    }
  }, [availableModels, selectedModel]);

  const {
    messages: aiMessages,
    append,
    reload,
    status,
    error,
    setMessages,
  } = useChat({
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
      // Update local chat history
      updateChatMessages();
    },
    onToolCall: ({ toolCall }) => {
      // eslint-disable-next-line no-console
      console.log("Tool called:", toolCall);
      setIsProcessingTool(true);
    },
  });

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Use AI messages when available, otherwise fall back to local chat messages
  const displayMessages =
    aiMessages.length > 0
      ? aiMessages.map((msg) => ({
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
        }))
      : selectedChat?.messages || [];

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
        return prevChats.map((chat) =>
          chat.id === selectedChatId
            ? { ...chat, messages: formattedMessages, timestamp: new Date() }
            : chat,
        );
      } else {
        // Create new chat if it doesn't exist
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
  }, [aiMessages, selectedChatId]);

  // Update chat messages when AI messages change
  useEffect(() => {
    updateChatMessages();
  }, [aiMessages, updateChatMessages]);

  // Initialize with a default chat
  useEffect(() => {
    if (chats.length === 0) {
      const initialChat: Chat = {
        id: `chat-${Date.now()}`,
        title: "New Chat",
        timestamp: new Date(),
        messages: [],
      };
      setChats([initialChat]);
      setSelectedChatId(initialChat.id);
    }
  }, [chats.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [displayMessages.length, status]);

  // Reset tool processing state when not loading
  useEffect(() => {
    if (status !== "streaming") {
      setIsProcessingTool(false);
    }
  }, [status]);

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
          // In a real app, you would upload the file to a server here
          // For now, we'll create a data URL
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
      const messageContent = inputValue;
      setInputValue("");
      setAttachedFiles([]);

      // Append message with attachments
      await append({
        content: messageContent,
        role: "user",
        experimental_attachments: attachments,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      // Restore input on error
      setInputValue(inputValue);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const fileArray = [...files];

    // Validate file types
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

  const handleChatRename = (chatId: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  const handleChatDelete = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

    // If the deleted chat was selected, select the first available chat
    if (selectedChatId === chatId) {
      const remainingChat = chats.find((chat) => chat.id !== chatId);
      setSelectedChatId(remainingChat?.id || "");
      // Clear AI messages when switching chats
      setMessages([]);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Clear messages when switching chats
    setMessages([]);
  };

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <aside
        className={cn(
          layoutStyles.sidebar,
          "bg-section-sidebar",
          "border-border/50",
        )}
      >
        <div className="flex h-[73px] items-center pr-4 pl-6">
          <h1
            className="relative text-3xl font-bold"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            <span className="gradient-text tracking-wider">AI CHATBOT</span>
            <span
              aria-hidden="true"
              className="gradient-bg absolute inset-0 opacity-30 blur-xl"
            >
              AI CHATBOT
            </span>
          </h1>
        </div>
        <div className="px-6 pb-4">
          <Button
            className="w-full tracking-wider uppercase"
            onClick={() => {
              const newChat: Chat = {
                id: `chat-${Date.now()}`,
                title: "New Chat",
                timestamp: new Date(),
                messages: [],
              };
              setChats([newChat, ...chats]);
              setSelectedChatId(newChat.id);
            }}
            size="sm"
            variant="default"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="flex-1 text-center">New Chat</span>
            <span className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatHistory
            chats={chats}
            className="h-full"
            onChatDelete={handleChatDelete}
            onChatRename={handleChatRename}
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChatId}
          />
        </div>
      </aside>

      <main className={cn(layoutStyles.main, "bg-section-main")}>
        <header
          className={cn(
            layoutStyles.header,
            "bg-section-header",
            "border-border/50",
          )}
        >
          <h1 className="text-xl font-bold">
            {selectedChat?.title || "Select a chat"}
          </h1>
          <div className="flex items-center gap-4">
            <ModelSelector
              availableModels={availableModels}
              className="min-w-[160px]"
              onModelChange={setSelectedModel}
              selectedModel={selectedModel}
            />
            <span className="text-muted-foreground text-sm">{username}</span>
            <ThemeSwitcher />
          </div>
        </header>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-6">
            <div className="mx-auto max-w-3xl space-y-4">
              {displayMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
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
                    onClick={() => reload()}
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

        <footer
          className={cn(
            layoutStyles.footer,
            "bg-section-footer",
            "border-border/50",
          )}
        >
          <div className="mx-auto max-w-3xl">
            <div className="inner-glow-focus relative rounded-lg">
              <ChatTextarea
                className="border-2 border-gray-300 bg-white pr-24 shadow-sm transition-all duration-200 dark:border-gray-600 dark:bg-gray-900"
                onChange={setInputValue}
                onSubmit={handleSendMessage}
                placeholder="Type your message..."
                value={inputValue}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <ChatFileUploadButton
                  onFileSelect={handleFileSelect}
                  selectedFiles={attachedFiles}
                />
                <Button
                  disabled={
                    (!inputValue.trim() && attachedFiles.length === 0) ||
                    status === "streaming"
                  }
                  onClick={handleSendMessage}
                  size="icon"
                  variant="default"
                >
                  {status === "streaming" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {status === "streaming" ? "Sending..." : "Send message"}
                  </span>
                </Button>
              </div>
            </div>
            {attachedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <span
                    className="bg-background/50 border-border/50 rounded-full border px-3 py-1 text-sm backdrop-blur-sm"
                    key={index}
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

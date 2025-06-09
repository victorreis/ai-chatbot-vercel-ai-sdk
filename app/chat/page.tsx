"use client";

import { Plus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { mockChats } from "@/__mocks__/chats.mocks";
import { ChatFileUploadButton } from "@/components/ChatFileUploadButton";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatTextarea } from "@/components/ChatTextarea";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { layoutStyles } from "@/styles";
import type { Chat } from "@/types/chat";
import { cn } from "@/utils/cn";

export default function ChatPage() {
  const [chats, setChats] = useState(mockChats);
  const [selectedChatId, setSelectedChatId] = useState(mockChats[0]?.id);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const username = "Guest User";

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const messages = selectedChat?.messages || [];

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
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user" as const,
      timestamp: new Date(),
      attachments: attachedFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };

    if (selectedChat) {
      const updatedChat: Chat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        timestamp: new Date(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId ? updatedChat : chat,
        ),
      );
    }

    setInputValue("");
    setAttachedFiles([]);

    // Simulate AI response
    setTimeout(() => {
      if (selectedChat) {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content:
            "This is a mock AI response. The actual AI integration will be implemented later.",
          role: "assistant" as const,
          timestamp: new Date(),
        };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, aiResponse],
                  timestamp: new Date(),
                }
              : chat,
          ),
        );
      }
    }, 1000);
  };

  const handleFileSelect = (files: FileList) => {
    setAttachedFiles([...files]);
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
    }
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
            onChatSelect={setSelectedChatId}
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
            <span className="text-muted-foreground text-sm">{username}</span>
            <ThemeSwitcher />
          </div>
        </header>

        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-6">
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
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
                  disabled={!inputValue.trim() && attachedFiles.length === 0}
                  onClick={handleSendMessage}
                  size="icon"
                  variant="default"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
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

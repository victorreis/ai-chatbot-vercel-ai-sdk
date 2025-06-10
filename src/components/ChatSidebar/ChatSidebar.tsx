import { Plus } from "lucide-react";

import { ChatHistory } from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { layoutStyles } from "@/styles";
import type { Chat } from "@/types/chat";
import { cn } from "@/utils/cn";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
  onChatRename: (chatId: string, newTitle: string) => void;
  onChatDelete: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onChatSelect,
  onChatRename,
  onChatDelete,
  onNewChat,
}: ChatSidebarProps) {
  return (
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
          onClick={onNewChat}
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
          onChatDelete={onChatDelete}
          onChatRename={onChatRename}
          onChatSelect={onChatSelect}
          selectedChatId={selectedChatId}
        />
      </div>
    </aside>
  );
}

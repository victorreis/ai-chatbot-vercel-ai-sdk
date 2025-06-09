import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/types/chat";
import { cn } from "@/utils/cn";
import { getRelativeTimeString } from "@/utils/date";

interface ChatHistoryProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onChatRename?: (chatId: string, newTitle: string) => void;
  onChatDelete?: (chatId: string) => void;
  className?: string;
}

export function ChatHistory({
  chats,
  selectedChatId,
  onChatSelect,
  onChatRename,
  onChatDelete,
  className,
}: ChatHistoryProps) {
  const groupedChats = groupChatsByDate(chats);

  return (
    <ScrollArea className={cn("h-full overflow-hidden", className)}>
      <div className="space-y-6 p-3">
        {Object.entries(groupedChats).map(([date, dateChats]) => (
          <div key={date}>
            <div className="text-muted-foreground mb-3 px-3 text-xs font-semibold">
              {date}
            </div>
            <div className="space-y-1">
              {dateChats.map((chat) => (
                <div
                  className={cn(
                    "group relative cursor-pointer rounded-lg px-3 py-2 transition-all duration-200",
                    selectedChatId === chat.id
                      ? "bg-primary/6 dark:bg-primary/13 shadow-xs"
                      : "hover:bg-primary/6 hover:dark:bg-primary/13 hover:shadow-xs",
                  )}
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div
                        className="truncate text-sm font-medium"
                        title={chat.title}
                      >
                        {chat.title}
                      </div>
                    </div>
                    <DropdownMenu
                      trigger={
                        <Button
                          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreVertical className="h-3 w-3" />
                          <span className="sr-only">Chat options</span>
                        </Button>
                      }
                    >
                      <div className="min-w-[160px]">
                        <div className="text-muted-foreground p-2 text-sm">
                          <div className="space-y-1 text-xs">
                            <p>
                              Created:{" "}
                              {chat.timestamp.toLocaleDateString("en-US")}
                            </p>
                            <p>
                              Time: {chat.timestamp.toLocaleTimeString("en-US")}
                            </p>
                            <p>Messages: {chat.messages.length}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (onChatRename) {
                              const newTitle = prompt(
                                "Enter new chat title:",
                                chat.title,
                              );
                              if (newTitle && newTitle.trim()) {
                                onChatRename(chat.id, newTitle.trim());
                              }
                            }
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          destructive
                          onClick={() => {
                            if (
                              onChatDelete &&
                              confirm(
                                "Are you sure you want to delete this chat?",
                              )
                            ) {
                              onChatDelete(chat.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function groupChatsByDate(chats: Chat[]) {
  const grouped: Record<string, Chat[]> = {};

  for (const chat of chats) {
    const relativeTime = getRelativeTimeString(chat.timestamp);

    if (!grouped[relativeTime]) {
      grouped[relativeTime] = [];
    }

    grouped[relativeTime].push(chat);
  }

  // Sort the groups to ensure proper order
  const orderedGroups: Record<string, Chat[]> = {};
  const sortOrder = ["Today", "Yesterday"];

  // First add Today and Yesterday if they exist
  for (const key of sortOrder) {
    if (grouped[key]) {
      orderedGroups[key] = grouped[key];
    }
  }

  // Then add the rest sorted by timestamp
  for (const [key, value] of Object.entries(grouped)
    .filter(([key]) => !sortOrder.includes(key))
    .sort((a, b) => {
      const aTime = a[1][0]?.timestamp.getTime() || 0;
      const bTime = b[1][0]?.timestamp.getTime() || 0;
      return bTime - aTime;
    })) {
    orderedGroups[key] = value;
  }

  return orderedGroups;
}

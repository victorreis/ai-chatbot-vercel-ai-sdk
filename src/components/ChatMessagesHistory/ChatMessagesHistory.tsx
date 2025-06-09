import { Info } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { getRelativeTimeString } from "@/utils/date";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessagesHistoryProps {
  messages: Message[];
  className?: string;
}

export function ChatMessagesHistory({
  messages,
  className,
}: ChatMessagesHistoryProps) {
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-4 p-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="text-muted-foreground mb-2 text-xs font-semibold">
              {date}
            </div>
            <div className="space-y-2">
              {dateMessages.map((message) => (
                <div
                  className="hover:bg-muted/50 cursor-pointer rounded-lg p-3 transition-colors"
                  key={message.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {message.content}
                      </div>
                    </div>
                    <Button
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(
                          showInfo === message.id ? null : message.id,
                        );
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <Info className="h-3 w-3" />
                      <span className="sr-only">Show info</span>
                    </Button>
                  </div>
                  {showInfo === message.id && (
                    <div className="text-muted-foreground mt-2 text-xs">
                      <p>
                        Date: {message.timestamp.toLocaleDateString("en-US")}
                      </p>
                      <p>
                        Time: {message.timestamp.toLocaleTimeString("en-US")}
                      </p>
                      <p>ID: {message.id}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {date !==
              Object.keys(groupedMessages)[
                Object.keys(groupedMessages).length - 1
              ] && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function groupMessagesByDate(messages: Message[]) {
  const grouped: Record<string, Message[]> = {};

  for (const message of messages) {
    const relativeTime = getRelativeTimeString(message.timestamp);

    if (!grouped[relativeTime]) {
      grouped[relativeTime] = [];
    }

    grouped[relativeTime].push(message);
  }

  // Sort the groups to ensure proper order
  const orderedGroups: Record<string, Message[]> = {};
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

import { useEffect, useRef } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";

interface ChatTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  maxRows?: number;
}

export function ChatTextarea({
  value,
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  className,
  maxRows = 5,
}: ChatTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * maxRows;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Textarea
      className={cn("min-h-[60px] resize-none transition-all", className)}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      ref={textareaRef}
      rows={3}
      value={value}
    />
  );
}

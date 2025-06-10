import { Loader2, Send } from "lucide-react";

import { ChatFileUploadButton } from "@/components/ChatFileUploadButton";
import { ChatTextarea } from "@/components/ChatTextarea";
import { Button } from "@/components/ui/button";
import { layoutStyles } from "@/styles";
import { cn } from "@/utils/cn";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  attachedFiles: File[];
  onFileSelect: (files: FileList) => void;
  disabled: boolean;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  attachedFiles,
  onFileSelect,
  disabled,
  isLoading,
}: ChatInputProps) {
  return (
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
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Type your message..."
            value={value}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <ChatFileUploadButton
              onFileSelect={onFileSelect}
              selectedFiles={attachedFiles}
            />
            <Button
              disabled={disabled || isLoading}
              onClick={onSubmit}
              size="icon"
              variant="default"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isLoading ? "Sending..." : "Send message"}
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
  );
}

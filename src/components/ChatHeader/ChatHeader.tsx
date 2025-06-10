import { ModelSelector, type Model } from "@/components/ModelSelector";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { layoutStyles } from "@/styles";
import { cn } from "@/utils/cn";

interface ChatHeaderProps {
  title: string;
  username: string;
  selectedModel: string;
  availableModels: Model[];
  onModelChange: (modelId: string) => void;
}

export function ChatHeader({
  title,
  username,
  selectedModel,
  availableModels,
  onModelChange,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        layoutStyles.header,
        "bg-section-header",
        "border-border/50",
      )}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <ModelSelector
          availableModels={availableModels}
          className="min-w-[160px]"
          onModelChange={onModelChange}
          selectedModel={selectedModel}
        />
        <span className="text-muted-foreground text-sm">{username}</span>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

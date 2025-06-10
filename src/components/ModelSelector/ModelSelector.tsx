import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

export interface Model {
  id: string;
  name: string;
  provider: "openai" | "google";
  description?: string;
  disabled?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  availableModels: Model[];
  className?: string;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  availableModels,
  className,
}: ModelSelectorProps) {
  const currentModel = availableModels.find(
    (model) => model.id === selectedModel,
  );

  const triggerButton = (
    <Button
      className={cn("justify-between gap-2", className)}
      disabled={availableModels.length === 0}
      size="sm"
      variant="outline"
    >
      <span className="truncate">
        {currentModel ? currentModel.name : "Select model"}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  return (
    <DropdownMenu align="end" className="w-[250px]" trigger={triggerButton}>
      {availableModels.length > 0 ? (
        availableModels.map((model) => (
          <DropdownMenuItem
            className={cn(
              "flex items-center justify-between",
              model.disabled && "cursor-not-allowed opacity-50",
            )}
            key={model.id}
            onClick={() => {
              if (!model.disabled) {
                onModelChange(model.id);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-medium">{model.name}</span>
              {model.description && (
                <span className="text-muted-foreground text-xs">
                  {model.description}
                </span>
              )}
            </div>
            {selectedModel === model.id && (
              <Check className="h-4 w-4 shrink-0" />
            )}
          </DropdownMenuItem>
        ))
      ) : (
        <div className="text-muted-foreground p-2 text-center text-sm">
          No models available
        </div>
      )}
    </DropdownMenu>
  );
}

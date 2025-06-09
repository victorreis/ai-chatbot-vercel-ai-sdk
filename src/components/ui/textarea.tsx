import * as React from "react";

import { cn } from "@/utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring bg-background/50 focus:border-primary/50 flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm backdrop-blur-sm transition-all duration-200 focus:shadow-md focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

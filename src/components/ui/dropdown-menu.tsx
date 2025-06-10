"use client";

import * as React from "react";

import { cn } from "@/utils/cn";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  destructive?: boolean;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenu({
  trigger,
  children,
  align = "end",
  sideOffset = 4,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        ref={triggerRef}
      >
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "text-popover-foreground border-border/50 soft-shadow animate-in fade-in-0 zoom-in-95 bg-popover absolute z-50 min-w-[8rem] cursor-default overflow-hidden rounded-lg border p-1 shadow-xl",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          ref={dropdownRef}
          style={{ top: `calc(100% + ${sideOffset}px)` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  destructive = false,
}: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-all duration-200 outline-none select-none",
        destructive
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className,
}: DropdownMenuSeparatorProps) {
  return <div className={cn("bg-muted -mx-1 my-1 h-px", className)} />;
}

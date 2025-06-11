import { Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface ChatFileUploadButtonProps {
  onFileSelect: (files: FileList) => void;
  selectedFiles: File[];
  accept?: string;
  multiple?: boolean;
}

export function ChatFileUploadButton({
  onFileSelect,
  selectedFiles,
  accept = ".pdf,.png,.jpg,.jpeg,.gif,.webp",
  multiple = true,
}: ChatFileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(0);

  // Clear the file input when selected files are cleared
  useEffect(() => {
    if (selectedFiles.length === 0) {
      // Force re-render of the input by changing its key
      setInputKey((prev) => prev + 1);
    }
  }, [selectedFiles.length]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
      // Clear the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        accept={accept}
        className="hidden"
        key={inputKey}
        multiple={multiple}
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
      <Button
        className="relative"
        onClick={handleClick}
        size="icon"
        type="button"
        variant="outline"
      >
        <Paperclip className="h-4 w-4" />
        {selectedFiles.length > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
            {selectedFiles.length}
          </span>
        )}
      </Button>
    </>
  );
}

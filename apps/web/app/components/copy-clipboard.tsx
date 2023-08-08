import { Copy, CheckCheck } from "lucide-react";
import { useCallback, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ui";
import { Button } from "ui";

export function CopyClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyToClipboard(text)}
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Copy className="w-4 h-4 flex-shrink-0" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { cn } from "@codeforge-v2/ui/lib/utils";

interface ErrorDisplayProps {
  message: string;
  centered?: boolean;
  className?: string;
}

export function ErrorDisplay({
  message,
  centered = false,
  className,
}: ErrorDisplayProps) {
  if (centered) {
    return (
      <div className="flex h-full items-center justify-center">
        <div
          className={cn(
            "rounded-lg border border-destructive bg-destructive/10 p-4",
            className
          )}
        >
          <p className="text-destructive">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-destructive bg-destructive/10 p-4",
        className
      )}
    >
      <p className="text-destructive">{message}</p>
    </div>
  );
}

import { cn } from "@codeforge-v2/ui/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

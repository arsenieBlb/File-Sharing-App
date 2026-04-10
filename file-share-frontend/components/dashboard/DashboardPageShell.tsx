import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardPageShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10",
        className
      )}
    >
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

export function dashboardCardClassName() {
  return "overflow-hidden border-border/80 bg-card shadow-sm dark:border-white/10";
}

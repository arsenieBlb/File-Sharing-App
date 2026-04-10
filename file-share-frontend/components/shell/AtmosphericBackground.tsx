import { cn } from "@/lib/utils";

export function AtmosphericBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "dark relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[min(80vh,36rem)] w-[min(120vw,64rem)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,hsl(263_70%_45%/0.45),transparent_65%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-15%] h-[min(50vh,28rem)] w-[min(90vw,28rem)] rounded-full bg-[radial-gradient(circle,hsl(199_89%_48%/0.22),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_10%_4%/0.2)_0%,transparent_35%,transparent_70%,hsl(240_10%_4%/0.85)_100%)]" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}

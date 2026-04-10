"use client";

import Link from "next/link";
import { LogoutButton } from "../auth/LogoutButton";
import { usePathname } from "next/navigation";
import { ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/upload", label: "My uploads" },
  { href: "/receive", label: "Received" },
  { href: "/profile", label: "Profile" },
];

export const Header = () => {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-[1.02]">
            <ShieldCheckIcon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-base sm:text-lg">SecureShare</span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-0.5 sm:gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathName === href || pathName.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <LogoutButton className="shrink-0 rounded-full">
          Logout
        </LogoutButton>
      </div>
    </header>
  );
};

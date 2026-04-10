"use client";

import Link from "next/link";
import { LogoutButton } from "../auth/LogoutButton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/upload", label: "My Uploads" },
  { href: "/receive", label: "Received Files" },
  { href: "/profile", label: "Profile" },
];

export const Header = () => {
  const pathName = usePathname();

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-slate-900 text-white shrink-0">
      <div className="text-xl font-bold tracking-tight">
        <Link href="/">🔐 SecureShare</Link>
      </div>

      <nav className="flex items-center gap-1">
        {navLinks.map(({ href, label }) => {
          const isActive = pathName === href || pathName.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-white/15 font-medium"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <LogoutButton>Logout</LogoutButton>
    </header>
  );
};

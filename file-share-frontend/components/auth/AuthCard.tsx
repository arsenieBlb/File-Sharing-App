"use client";

import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/brand";

interface AuthCardProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
  className?: string;
}

export const AuthCard = ({
  backButtonHref,
  backButtonLabel,
  children,
  headerLabel,
  className,
}: AuthCardProps) => {
  return (
    <Card
      className={cn(
        "w-full max-w-[400px] border-white/10 bg-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-xl",
        className
      )}
    >
      <CardHeader className="space-y-0 pb-2 pt-8">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/30">
            <ShieldCheckIcon className="h-7 w-7" strokeWidth={2.25} />
          </span>
          <div className="text-center">
            <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground">
              {APP_NAME}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{headerLabel}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-2 pt-4">{children}</CardContent>
      <CardFooter className="flex flex-col gap-2 pb-8 pt-2">
        <Button
          variant="link"
          className="h-auto w-full font-normal text-muted-foreground hover:text-foreground"
          size="sm"
          asChild
        >
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

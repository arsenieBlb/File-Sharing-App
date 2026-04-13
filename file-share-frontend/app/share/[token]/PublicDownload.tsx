"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  DownloadIcon,
  LockIcon,
  ShieldCheckIcon,
  TimerIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AtmosphericBackground } from "@/components/shell/AtmosphericBackground";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/brand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ShareInfo = {
  file_name: string;
  sender_name: string;
  expiration_date: string;
};

export function PublicDownload({ token }: { token: string }) {
  const [info, setInfo] = useState<ShareInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  // Fetch share info on mount
  useEffect(() => {
    (async () => {
      if (!API_URL) {
        setExpired(true);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/share/${encodeURIComponent(token)}`);
        if (res.status === 404) {
          setExpired(true);
          return;
        }
        if (!res.ok) {
          setExpired(true);
          return;
        }
        const data = await res.json();
        if (data.status === "fail" || typeof data.file_name !== "string") {
          setExpired(true);
          return;
        }
        const exp =
          typeof data.expiration_date === "string"
            ? data.expiration_date
            : data.expiration_date != null
              ? String(data.expiration_date)
              : "";
        setInfo({
          file_name: data.file_name,
          sender_name:
            typeof data.sender_name === "string" ? data.sender_name : "",
          expiration_date: exp,
        });
      } catch {
        setExpired(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsDownloading(true);
    try {
      if (!API_URL) {
        toast.error("API URL is not configured.");
        return;
      }
      const res = await fetch(
        `${API_URL}/share/${encodeURIComponent(token)}/download`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: values.password }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Download failed" }));
        toast.error(err.message || "Download failed");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", info?.file_name ?? "download");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── States ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <PageWrapper>
        <Card className="w-full max-w-md border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
          <CardContent className="p-10 text-center text-muted-foreground">
            <ShareBrandHomeLink className="mb-6" />
            <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full bg-primary/30" />
            Loading share info…
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  if (expired || !info) {
    return (
      <PageWrapper>
        <Card className="w-full max-w-md border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
          <CardContent className="space-y-4 p-10 text-center">
            <ShareBrandHomeLink className="mb-2" />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30 text-2xl">
              ⏰
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Link expired or not found
            </h2>
            <p className="text-sm text-muted-foreground">
              This share link has expired, was already deleted, or does not
              exist.
            </p>
            <Button asChild variant="secondary" className="mt-2 rounded-full">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const expiryDate = new Date(info.expiration_date);

  return (
    <PageWrapper>
      <Card className="w-full max-w-md overflow-hidden border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-4 pt-8 text-center">
          <ShareBrandHomeLink />
          <p className="text-sm text-muted-foreground">
            Someone shared a file with you
          </p>
        </CardHeader>
        <Separator className="bg-white/10" />
        <CardContent className="space-y-5 p-6">
          {/* File info */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm">
            <InfoRow
              icon={<DownloadIcon className="h-4 w-4" />}
              label="File"
              value={info.file_name}
            />
            <InfoRow
              icon={<UserIcon className="h-4 w-4" />}
              label="Shared by"
              value={info.sender_name}
            />
            <InfoRow
              icon={<TimerIcon className="h-4 w-4" />}
              label="Expires"
              value={format(expiryDate, "PPP p")}
            />
          </div>

          {/* Password form */}
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <LockIcon className="h-3.5 w-3.5" /> File Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter the file password"
                        disabled={isDownloading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-full shadow-lg shadow-primary/20"
                isLoading={isDownloading}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download file
              </Button>
            </form>
          </Form>

          <p className="text-xs text-center text-muted-foreground">
            Stored encrypted and protected by your password.{" "}
            <Link href="/" className="underline">
              Learn more
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function ShareBrandHomeLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group mx-auto flex flex-col items-center gap-2 rounded-xl p-1 text-center outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-[1.02]">
        <ShieldCheckIcon className="h-7 w-7" strokeWidth={2.25} />
      </span>
      <span className="text-balance text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
        {APP_NAME}
      </span>
    </Link>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AtmosphericBackground>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </AtmosphericBackground>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="font-medium break-all">{value}</span>
    </div>
  );
}

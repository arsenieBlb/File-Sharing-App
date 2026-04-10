"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { DownloadIcon, LockIcon, TimerIcon, UserIcon } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      try {
        const res = await fetch(`${API_URL}/share/${token}`);
        if (res.status === 404) {
          setExpired(true);
          return;
        }
        if (!res.ok) {
          setExpired(true);
          return;
        }
        const data = await res.json();
        setInfo(data);
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
      const res = await fetch(`${API_URL}/share/${token}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

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
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading share info…
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  if (expired || !info) {
    return (
      <PageWrapper>
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-2xl">⏰</p>
            <h2 className="font-semibold text-lg">Link expired or not found</h2>
            <p className="text-muted-foreground text-sm">
              This share link has expired, was already deleted, or does not
              exist.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/">Go to SecureShare</Link>
            </Button>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const expiryDate = new Date(info.expiration_date);

  return (
    <PageWrapper>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <p className="text-3xl">🔐</p>
          <CardTitle className="text-xl">SecureShare</CardTitle>
          <p className="text-muted-foreground text-sm">
            Someone shared a file with you
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 space-y-5">
          {/* File info */}
          <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm">
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
                className="w-full"
                isLoading={isDownloading}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </form>
          </Form>

          <p className="text-xs text-center text-muted-foreground">
            This file is end-to-end encrypted.{" "}
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

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-12">
      {children}
    </div>
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

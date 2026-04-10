"use client";

import { searchEmail } from "@/actions/file";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CopyIcon, CheckIcon, LinkIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseSchema = {
  password: z.string().min(6, "Password must be at least 6 characters"),
  expiration_date: z
    .date()
    .refine((val) => val >= new Date(), "Expiration date must be in the future"),
  fileUpload: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) =>
        file &&
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          file.type
        ),
      "Only JPG, PNG, and PDF files are allowed"
    )
    .refine((file) => file && file.size <= 4 * 1024 * 1024, {
      message: "File size must be 4 MB or less",
    }),
};

const registeredSchema = z.object({
  ...baseSchema,
  mode: z.literal("registered"),
  recipient_email: z.string().email("Please enter a valid email address"),
});

const publicSchema = z.object({
  ...baseSchema,
  mode: z.literal("public"),
  recipient_email: z.string().optional(),
});

const emailFormSchema = z.discriminatedUnion("mode", [
  registeredSchema,
  publicSchema,
]);

type FormValues = z.infer<typeof emailFormSchema>;

// ── Share-link modal ──────────────────────────────────────────────────────────

function ShareLinkModal({
  token,
  onClose,
}: {
  token: string;
  onClose: () => void;
}) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Your share link is ready!</h2>
        <p className="text-sm text-muted-foreground">
          Send this link to anyone. They will need the file password to
          download.
        </p>
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-muted text-sm break-all">
          <span className="flex-1">{shareUrl}</span>
          <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-foreground">
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const UploadNew = ({ token }: { token: string | null }) => {
  const [emailSuggestions, setEmailSuggestions] = useState<{ email: string }[]>([]);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const router = useRouter();

  const tomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      mode: "registered",
      recipient_email: "",
      password: "",
      expiration_date: tomorrow(),
    } as FormValues,
  });

  const mode = form.watch("mode");
  const recipient_email = form.watch("recipient_email") ?? "";
  const password = form.watch("password");
  const expirationDate = form.watch("expiration_date");
  const isFormFilled = password && expirationDate && (mode === "public" || recipient_email);

  // Debounced email suggestion fetch
  useEffect(() => {
    if (mode !== "registered" || !recipient_email) return;
    const timer = setTimeout(async () => {
      setIsFetchingEmails(true);
      try {
        const res = await searchEmail(recipient_email);
        setEmailSuggestions(res.emails || []);
      } catch {
        // silently ignore suggestion errors
      } finally {
        setIsFetchingEmails(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [recipient_email, mode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) form.setValue("fileUpload", file);
  };

  const onSubmit = async (values: FormValues) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("recipient_email", values.mode === "registered" ? values.recipient_email : "");
      formData.append("password", values.password);
      formData.append("expiration_date", values.expiration_date.toISOString());
      formData.append("fileUpload", values.fileUpload);

      const response = await fetch(`${API_URL}/file/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Upload failed");
        return;
      }

      if (result.share_token) {
        setShareToken(result.share_token);
      } else {
        toast.success(result.message);
        router.push("/upload");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {shareToken && (
        <ShareLinkModal
          token={shareToken}
          onClose={() => {
            setShareToken(null);
            router.push("/upload");
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload new File</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

              {/* Share mode toggle */}
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  type="button"
                  onClick={() => form.setValue("mode", "registered")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-colors",
                    mode === "registered"
                      ? "bg-slate-900 text-white"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  <UserIcon className="h-4 w-4" /> Share with user
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("mode", "public")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm transition-colors",
                    mode === "public"
                      ? "bg-slate-900 text-white"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  <LinkIcon className="h-4 w-4" /> Create public link
                </button>
              </div>

              {/* Recipient email — only for registered mode */}
              {mode === "registered" && (
                <FormField
                  control={form.control}
                  name="recipient_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type or select recipient's email" />
                          </SelectTrigger>
                          <SelectContent>
                            <Input
                              placeholder="Type to search email"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            {isFetchingEmails ? (
                              <SelectItem value="__loading__" disabled>
                                Loading...
                              </SelectItem>
                            ) : emailSuggestions.length > 0 ? (
                              emailSuggestions.map((e) => (
                                <SelectItem key={e.email} value={e.email}>
                                  {e.email}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="__none__" disabled>
                                No matching users found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "public" && (
                <p className="rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
                  A link will be generated that anyone can use to download your file using the password below.
                </p>
              )}

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Password</FormLabel>
                    <FormControl>
                      <Input {...field} enablePasswordToggle disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiration date */}
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isPending}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* File upload */}
              <FormField
                control={form.control}
                name="fileUpload"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileUpload}
                        disabled={!isFormFilled || isPending}
                        aria-describedby="file-constraints"
                      />
                    </FormControl>
                    <p id="file-constraints" className="text-xs text-muted-foreground">
                      Accepted: JPG, PNG, PDF · Max size: 4 MB
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" isLoading={isPending}>
                {mode === "public" ? "Upload & Generate Link" : "Upload File"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

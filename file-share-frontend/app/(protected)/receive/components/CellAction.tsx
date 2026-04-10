import { Button } from "@/components/ui/button";
import { ReceiveColumnsType } from "./columns";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface CellActionProps {
  data: ReceiveColumnsType;
  token: string | null;
}

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" }),
});

export const CellAction = ({ data, token }: CellActionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/retrieve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shared_id: data.file_id,
            password: values.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to retrieve file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      form.reset();
      setIsOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong!";
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-end">
      <Button
        size="sm"
        variant="outline"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
        aria-label={`Download ${data.file_name}`}
      >
        <DownloadIcon className="mr-1.5 h-4 w-4" />
        Download
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-md dark:border-white/10">
          <DialogHeader className="border-b border-border/60 bg-muted/30 px-6 py-5 text-left dark:border-white/10 dark:bg-white/[0.04]">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Enter file password
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Use the password the sender shared with you for{" "}
              <span className="font-medium text-foreground">
                {data.file_name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
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
                      <FormLabel>File password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          enablePasswordToggle
                          disabled={isLoading}
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full rounded-full shadow-md shadow-primary/15"
                >
                  Download file
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordChangeSchema } from "../schema/profileType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { updateUserPassword } from "@/actions/profile";
import toast from "react-hot-toast";

export const PasswordChange = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirm: "",
    },
  });

  const onSubmit = (values: z.infer<typeof passwordChangeSchema>) => {
    startTransition(() => {
      updateUserPassword(values)
        .then((response) => {
          if (response.status === 400) {
            toast.error(response.message);
          }

          if (response.status == "success") {
            toast.success("Password updated successfully.");
            form.reset({
              old_password: "",
              new_password: "",
              new_password_confirm: "",
            });
          }
        })
                .catch(() => {});
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="••••••••"
                  enablePasswordToggle
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="••••••••"
                  enablePasswordToggle
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password_confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="••••••••"
                  enablePasswordToggle
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full shadow-md shadow-primary/15 sm:w-auto"
          disabled={isPending}
        >
          Update password
        </Button>
      </form>
    </Form>
  );
};

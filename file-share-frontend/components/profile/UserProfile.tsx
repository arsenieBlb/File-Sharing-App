"use client";

import { useForm } from "react-hook-form";
import { UserDataProps } from "./Profile";
import { z } from "zod";
import { nameUpdateSchema } from "../schema/profileType";
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
import { updateUserName } from "@/actions/profile";
import toast from "react-hot-toast";

export const Userprofile = ({ userData }: { userData: UserDataProps }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof nameUpdateSchema>>({
    resolver: zodResolver(nameUpdateSchema),
    defaultValues: {
      email: userData.email,
      name: userData.name,
    },
  });

  const onSubmit = (values: z.infer<typeof nameUpdateSchema>) => {
    startTransition(() => {
      updateUserName({ name: values.name })
        .then((response) => {
          if (response.status === 400) {
            toast.error(response.message);
          }

          if (response.status == "success") {
            toast.success("Name updated successfully.");
          }
        })
                .catch(() => {});
    });
  };

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Your email is fixed to your account. You can change how your name
        appears.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="john.doe@example.com"
                    type="email"
                    readOnly
                    className="bg-muted/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
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
            Save name
          </Button>
        </form>
      </Form>
    </div>
  );
};

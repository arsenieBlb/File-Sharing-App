"use client";

import { Card, CardContent } from "../ui/card";
import { Userprofile } from "./UserProfile";
import { PasswordChange } from "./PasswordChange";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { KeyRoundIcon, UserCircleIcon } from "lucide-react";

export interface UserDataProps {
  id: string;
  name: string;
  email: string;
  public_key: string | null;
}

export const Profile = ({ userData }: { userData: UserDataProps }) => {
  const initial = userData.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <DashboardPageShell
      title="Profile"
      description="Manage your account details and password."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-border/80 shadow-sm dark:border-white/10">
          <CardContent className="p-0">
            <div className="border-b border-border/60 bg-muted/20 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-lg font-semibold text-primary-foreground shadow-md shadow-primary/20">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold tracking-tight">
                    {userData.name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserCircleIcon className="h-4 w-4 text-primary" />
                Account
              </div>
              <Userprofile userData={userData} />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/80 shadow-sm dark:border-white/10">
          <CardContent className="p-0">
            <div className="border-b border-border/60 bg-muted/20 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <KeyRoundIcon className="h-4 w-4 text-primary" />
                Security
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your password to keep your account safe.
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <PasswordChange />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
};

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReceiveColumns, ReceiveColumnsType } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { InboxIcon } from "lucide-react";
import {
  DashboardPageShell,
  dashboardCardClassName,
} from "@/components/dashboard/DashboardPageShell";

interface ReceiveProps {
  data: ReceiveColumnsType[];
  total: number;
  token: string | null;
}

export const Receive = ({ data, total, token }: ReceiveProps) => {
  const columns = useReceiveColumns({ token });
  return (
    <DashboardPageShell
      title="Received files"
      description="Files other users have shared with your account."
    >
      <Card className={dashboardCardClassName()}>
        <CardHeader className="border-b border-border/60 bg-muted/20 px-4 py-5 sm:px-6 dark:border-white/10 dark:bg-white/[0.03]">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Inbox
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {total === 0
              ? "Nothing here yet"
              : `${total} file${total === 1 ? "" : "s"} total`}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <InboxIcon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  No files received yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  When someone shares a file with your email, it will show up
                  here. You’ll need the password they gave you to download.
                </p>
              </div>
            </div>
          ) : (
            <DataTable columns={columns} data={data} totalCount={total} />
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

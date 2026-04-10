"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadColumns, UploadColumnsType } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { PlusIcon, UploadCloudIcon } from "lucide-react";
import {
  DashboardPageShell,
  dashboardCardClassName,
} from "@/components/dashboard/DashboardPageShell";

interface UploadProps {
  data: UploadColumnsType[];
  total: number;
}

export const Upload = ({ data, total }: UploadProps) => {
  return (
    <DashboardPageShell
      title="My uploads"
      description="Everything you’ve shared — registered recipients or public links."
    >
      <Card className={dashboardCardClassName()}>
        <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-border/60 bg-muted/20 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Shared files
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {total === 0
                ? "No uploads yet"
                : `${total} file${total === 1 ? "" : "s"} total`}
            </p>
          </div>
          <Button
            asChild
            className="w-full shrink-0 rounded-full shadow-md shadow-primary/15 sm:w-auto"
          >
            <Link href="/upload/new" className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Share a file
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UploadCloudIcon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No files shared yet</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Upload a file, set a password and expiry, and send it to
                  someone or create a public link.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/upload/new" className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Share your first file
                </Link>
              </Button>
            </div>
          ) : (
            <DataTable columns={UploadColumns} data={data} totalCount={total} />
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

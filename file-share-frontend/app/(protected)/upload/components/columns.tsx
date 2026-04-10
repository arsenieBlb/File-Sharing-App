"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UploadColumnsType = {
  file_id: string;
  file_name: string;
  recipient_email: string;
  expiration_date: string;
  created_at: string;
};

function formatListDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const UploadColumns: ColumnDef<UploadColumnsType>[] = [
  {
    accessorKey: "file_name",
    header: "File",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 py-1">
        <span className="font-medium text-foreground">
          {row.original.file_name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.file_id.slice(0, 8)}…
        </span>
      </div>
    ),
  },
  {
    accessorKey: "recipient_email",
    header: "Recipient",
    cell: ({ row }) => {
      const email = row.original.recipient_email?.trim();
      if (!email) {
        return (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Public link
          </span>
        );
      }
      return <span className="text-foreground">{email}</span>;
    },
  },
  {
    accessorKey: "expiration_date",
    header: "Expires",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatListDate(row.original.expiration_date)}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Shared",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatListDate(row.original.created_at)}
      </span>
    ),
  },
];

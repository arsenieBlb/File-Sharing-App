"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";

export type ReceiveColumnsType = {
  file_id: string;
  file_name: string;
  sender_email: string;
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

export function useReceiveColumns({
  token,
}: {
  token: string | null;
}): ColumnDef<ReceiveColumnsType>[] {
  return [
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
      accessorKey: "sender_email",
      header: "From",
      cell: ({ row }) => (
        <span className="text-foreground">{row.original.sender_email}</span>
      ),
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
      header: "Received",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {formatListDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Download</span>,
      cell: ({ row }) => (
        <CellAction data={row.original} token={token} />
      ),
    },
  ];
}

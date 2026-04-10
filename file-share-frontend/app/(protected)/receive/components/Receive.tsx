"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useReceiveColumns, ReceiveColumnsType } from "./columns"
import { DataTable } from "@/components/ui/data-table";
import { InboxIcon } from "lucide-react";

interface ReceiveProps {
    data: ReceiveColumnsType[],
    total: number,
    token: string | null
}

export const Receive = ({ data, total, token }: ReceiveProps) => {
    const columes = useReceiveColumns({ token: token });
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Receive Files
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                        <InboxIcon className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No files received yet.</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columes}
                        data={data}
                        totalCount={total}
                    />
                )}
            </CardContent>
        </Card>
    )
}
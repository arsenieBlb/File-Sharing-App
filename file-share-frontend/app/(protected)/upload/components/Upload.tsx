"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadColumns, UploadColumnsType } from "./columns"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { UploadIcon } from "lucide-react";

interface UploadProps {
    data: UploadColumnsType[],
    total: number,
}

export const Upload = ({ data, total }: UploadProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
                <div className="flex items-end justify-end">
                    <Button asChild>
                        <Link href={"/upload/new"}>Share file</Link>
                    </Button>
                </div>
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                        <UploadIcon className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No files shared yet.</p>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/upload/new">Share your first file</Link>
                        </Button>
                    </div>
                ) : (
                    <DataTable
                        columns={UploadColumns}
                        data={data}
                        totalCount={total}
                    />
                )}
            </CardContent>
        </Card>
    )
}
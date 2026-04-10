import { auth } from "@/auth";
import { UploadNew } from "./components/UploadNew";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

const UploadNewPage = async () => {
    const session = await auth();
    return (
        <DashboardPageShell
            title="Share a file"
            description="Upload with a password and expiry. Send to a registered user or create a public link."
        >
            <UploadNew token={session?.user.accessToken || null} />
        </DashboardPageShell>
    )
}

export default UploadNewPage;
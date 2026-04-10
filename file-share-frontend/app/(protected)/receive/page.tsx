import { receive_file_list } from "@/actions/file";
import { Receive } from "./components/Receive";
import { auth } from "@/auth";


const ReceivePage = async ({ 
    searchParams 
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const fileData = await receive_file_list({
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 10,
    });
    const session = await auth();
    return (
        <Receive data={fileData.files} total={fileData.results} token={session?.user.accessToken || null} />
    )
}

export default ReceivePage;
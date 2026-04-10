import { Header } from "@/components/header/Header";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ProtectedLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header />
            <main className="flex-1 overflow-auto bg-muted/25">
                {children}
            </main>
        </div>
    )
}

export default ProtectedLayout;
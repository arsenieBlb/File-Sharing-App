import { PublicDownload } from "./PublicDownload";

interface PageProps {
  params: { token: string };
}

export const dynamic = "force-dynamic";

export default function SharePage({ params }: PageProps) {
  return <PublicDownload token={params.token} />;
}

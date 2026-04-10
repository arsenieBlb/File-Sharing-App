import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { LockIcon, LinkIcon, TimerIcon, ShieldIcon } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.accessToken;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-slate-900 text-white">
        <span className="text-xl font-bold tracking-tight">🔐 SecureShare</span>
        <div className="flex gap-3">
          {isLoggedIn ? (
            <Button asChild size="sm">
              <Link href="/upload">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <h1 className="text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
          Share files with <span className="text-blue-400">end-to-end encryption</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-xl">
          Upload a file, set a password and expiry date, and send a secure link — no account needed to download.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {isLoggedIn ? (
            <Button asChild size="lg">
              <Link href="/upload">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/register">Create free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-slate-700">
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<LockIcon className="h-8 w-8 text-blue-500" />}
            title="End-to-end encrypted"
            description="Files are encrypted before leaving your browser using AES + RSA. Only the intended recipient can decrypt."
          />
          <FeatureCard
            icon={<LinkIcon className="h-8 w-8 text-blue-500" />}
            title="Shareable links"
            description="Generate a public link anyone can use to download — no account required for the recipient."
          />
          <FeatureCard
            icon={<ShieldIcon className="h-8 w-8 text-blue-500" />}
            title="Password protected"
            description="Every shared file requires a password chosen by the sender to be downloaded."
          />
          <FeatureCard
            icon={<TimerIcon className="h-8 w-8 text-blue-500" />}
            title="Auto expiry"
            description="Set an expiry date. Files are automatically deleted from the server when they expire."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to share securely?</h2>
        <p className="text-slate-300 mb-8">Create a free account and start sharing in minutes.</p>
        {!isLoggedIn && (
          <Button asChild size="lg">
            <Link href="/register">Get Started — it&apos;s free</Link>
          </Button>
        )}
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} SecureShare. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-6 rounded-xl border bg-card">
      {icon}
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

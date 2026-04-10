import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  LinkIcon,
  LockIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.accessToken;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Ambient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/25" />
        <div className="absolute bottom-0 right-[-20%] h-[20rem] w-[20rem] rounded-full bg-cyan-500/10 blur-[80px] dark:bg-cyan-400/15" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-[1.02]">
              <ShieldCheckIcon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg">SecureShare</span>
          </Link>
          <nav className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild size="sm" className="rounded-full px-5">
                <Link href="/upload">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full px-5 shadow-md shadow-primary/20">
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              End-to-end encrypted file sharing
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.1]">
              Send files{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                without leaving traces
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
              Password-protected links, automatic expiry, and encryption before
              upload — recipients can download without an account.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {isLoggedIn ? (
                <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-lg shadow-primary/25">
                  <Link href="/upload" className="gap-2">
                    Open dashboard
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full px-8 shadow-lg shadow-primary/25"
                  >
                    <Link href="/register" className="gap-2">
                      Create free account
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Preview card */}
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="glass-panel-light rounded-2xl p-1 shadow-2xl dark:shadow-black/40">
              <div className="rounded-[0.875rem] border border-border/50 bg-card px-6 py-5 dark:border-white/5 dark:bg-zinc-900/80">
                <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4 dark:border-white/10">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Secure link
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground/90">
                      secureshare.app/share/••••••••
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    Encrypted
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                  <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-white/5">
                    <p className="text-xs text-muted-foreground">Password</p>
                    <p className="font-medium text-foreground">Required</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-white/5">
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="font-medium text-foreground">Auto-delete</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2 dark:bg-white/5">
                    <p className="text-xs text-muted-foreground">Recipient</p>
                    <p className="font-medium text-foreground">No account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-muted/30 py-20 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for sensitive handoffs
              </h2>
              <p className="mt-3 text-muted-foreground">
                Everything you need to share confidently, in one place.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<LockIcon className="h-6 w-6" />}
                title="Encrypted in transit"
                description="Files are encrypted in the browser with AES and RSA before they reach our servers."
              />
              <FeatureCard
                icon={<LinkIcon className="h-6 w-6" />}
                title="Public links"
                description="Share a link with anyone — they only need the password you set."
              />
              <FeatureCard
                icon={<ShieldCheckIcon className="h-6 w-6" />}
                title="Password gate"
                description="Every download is gated behind a secret only you and your recipient know."
              />
              <FeatureCard
                icon={<TimerIcon className="h-6 w-6" />}
                title="Time-boxed"
                description="Set an expiry date and we remove the file automatically when time is up."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-cyan-500/5 px-8 py-14 text-center dark:border-white/10 dark:from-primary/20 dark:via-zinc-900/50">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.2),transparent_55%)]"
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to share securely?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Create a free account and send your first encrypted file in
                minutes.
              </p>
              {!isLoggedIn && (
                <Button
                  asChild
                  size="lg"
                  className="mt-8 h-12 rounded-full px-8 shadow-lg shadow-primary/20"
                >
                  <Link href="/register">Get started — it&apos;s free</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SecureShare
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
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-900/40">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

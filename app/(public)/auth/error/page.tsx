import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Authentication error</h1>
        <p className="text-sm text-muted-foreground">
          We could not complete your sign in. Please try again.
        </p>
        <Link href="/auth/signin" className="text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}

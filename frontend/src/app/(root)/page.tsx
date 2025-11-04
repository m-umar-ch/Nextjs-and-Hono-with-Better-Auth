import SignOutButton from "@/components/common/sign-out-button";
import { Button } from "@/components/ui/button";
import { getUser } from "@/DAL/auth";
import Link from "next/link";

export default async function HomePage() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to Better Auth Starter {user?.email}
        </h1>

        <p className="text-muted-foreground">
          This is a full-stack Next.js + Hono + Better Auth setup. Sign in to
          continue.
        </p>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <>
              <SignOutButton />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login with Email or Google</Link>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Need help? Check out{" "}
          <a
            href="https://github.com/m-umar-ch/Nextjs-and-Hono-with-Better-Auth"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Our Docs
          </a>
        </p>
      </div>
    </main>
  );
}

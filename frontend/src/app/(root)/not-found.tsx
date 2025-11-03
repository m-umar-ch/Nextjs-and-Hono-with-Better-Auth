import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-2 text-xl text-gray-600">Page not found</p>
      <p className="mt-1 text-gray-500 max-w-md">
        The page {`you're`} looking for {`doesn't`} exist or has been moved.
      </p>

      <div className="mt-6">
        <Button asChild>
          <Link href="/" prefetch={false}>
            <ArrowLeft />
            Back to Home
          </Link>
        </Button>
      </div>
    </section>
  );
}

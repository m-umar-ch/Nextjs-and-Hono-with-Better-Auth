"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { getUserErrorMessage } from "@/lib/utils/userErrorMessage";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  // console.log("1219: Error:", error.message, "\n", error.cause, "\n", error);

  return (
    <section className="mx-auto flex h-screen max-w-sm flex-col items-center justify-center md:max-w-2xl">
      <h1 className="text-center text-3xl font-semibold text-primary">
        There was a Problem
      </h1>

      <h1 className="my-5 text-center text-xl text-foreground">
        {getUserErrorMessage(error)}
      </h1>

      <h2 className="text-center text-foreground/80">
        <span className="text-red-500">Try Reloading the page</span> or report{" "}
        <Link
          href={"mailto:ch256.it@gmail.com"}
          className="text-primary underline"
          prefetch={false}
        >
          here
        </Link>{" "}
        if the problem persists
      </h2>

      <div className="mt-6 flex items-center gap-6 md:gap-10">
        <Button
          variant={"outline"}
          className="border-primary bg-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
          onClick={reset}
        >
          Try again
        </Button>

        <Link href={"/"} prefetch={false}>
          Go to Home
        </Link>
      </div>
    </section>
  );
};

export default Error;

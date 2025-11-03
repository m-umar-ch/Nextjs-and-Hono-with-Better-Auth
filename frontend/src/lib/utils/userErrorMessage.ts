export function getUserErrorMessage(error: unknown) {
  if (!error) return "Something went wrong.";

  if (typeof error === "string") return error;

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // Hide technical / backend errors
    if (msg.includes("fetch failed") || msg.includes("failed to fetch")) {
      return "Unable to reach the server. Please try again later.";
    }

    if (msg.includes("networkerror") || msg.includes("connection")) {
      return "Network issue detected. Please check your connection.";
    }

    if (msg.includes("timeout")) {
      return "The server took too long to respond.";
    }

    if (msg.includes("unauthorized") || msg.includes("forbidden")) {
      return "You don't have permission to view this page.";
    }

    if (msg.includes("not found")) {
      return "The requested page could not be found.";
    }

    // Default fallback for unexpected errors
    return "Something went wrong. Please try again later.";
  }

  // Handle structured errors like { message: "..." }
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, never>;
    if (typeof err.message === "string") return err.message;
    if (typeof err.error === "string") return err.error;
  }

  return "An unexpected error occurred.";
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// String utilities
export {
  slugify,
  deSlugify,
  capitalize,
  toTitleCase,
  truncate,
  stripHtml,
} from "./string-utils";

// Async utilities and Result pattern
export {
  tryCatch,
  tryCatchSync,
  delay,
  timeout,
  withTimeout,
  retry,
  parallelLimit,
  isSuccess,
  isFailure,
  type Result,
} from "./async-utils";

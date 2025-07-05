import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with a URL-encoded message.
 * @param type - The type of message, used as a query parameter key.
 * @param path - The path to redirect to.
 * @param message - The message to be encoded in the URL.
 * @returns This function triggers a redirect and does not return.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?type=${type}&message=${encodeURIComponent(message)}`);
}

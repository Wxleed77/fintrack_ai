export type ToastType = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  type?: ToastType;
  action?: ToastAction;
  duration?: number;
}

export function toast(message: string, options: ToastOptions = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("fin:toast", { detail: { message, ...options } })
  );
}

export function toastError(message: string) {
  toast(message, { type: "error" });
}

export async function handleResponse(res: Response, fallback: string) {
  if (res.ok) return;
  let message = fallback;
  try {
    const data = await res.json();
    if (typeof data?.error === "string") message = data.error;
  } catch {
    // non-JSON error body — keep fallback
  }
  toastError(message);
  throw new Error(message);
}

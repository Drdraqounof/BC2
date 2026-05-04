import { useState } from "react";

interface ToastNotification {
  id: string;
  message: string;
  type: "error" | "success" | "info";
  duration?: number;
}

let nextToastId = 0;

function createToastId() {
  nextToastId += 1;
  return `toast-${nextToastId}`;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (message: string, type: "error" | "success" | "info" = "info", duration = 5000) => {
    const id = createToastId();
    const toast: ToastNotification = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export function Toast({ toasts, removeToast }: { toasts: ToastNotification[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-between gap-3 ${
            toast.type === "error"
              ? "bg-red-500"
              : toast.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:opacity-80"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

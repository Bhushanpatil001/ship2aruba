import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes with clsx and tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date) {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Returns a color class based on the package status
 */
export function getStatusStyles(status) {
  switch (status) {
    case "READY_TO_SEND":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PENDING_INVOICE_REVIEW":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "INVOICE_APPROVED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "NEEDS_REVIEW":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "SHIP_REQUESTED":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "READY_FOR_PICKUP":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "DELIVERED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

/**
 * Formats status string for display
 */
export function formatStatus(status) {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

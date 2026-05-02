// ============================================================
// VARNI JEWELS — Real Action Engine
// Utility functions that perform REAL actions (not just toasts)
// ============================================================

/**
 * Export an array of objects to a CSV file with BOM for Excel compatibility.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map(escapeCSV).join(","));

  // Data rows
  for (const row of data) {
    const values = headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    });
    csvRows.push(values.map(escapeCSV).join(","));
  }

  // BOM prefix for Excel UTF-8 support
  const bom = "\uFEFF";
  const csvString = bom + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

/**
 * Export any data as a pretty-printed JSON file.
 */
export function exportToJSON(data: unknown, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;",
  });
  triggerDownload(
    blob,
    filename.endsWith(".json") ? filename : `${filename}.json`
  );
}

/** Escape a CSV field that may contain commas, quotes, or newlines. */
function escapeCSV(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Create a temporary <a> element, click it to download, then clean up. */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  // Cleanup after a short delay to ensure the download starts
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// ------------------------------------------------------------------
// Generate a unique ID (simple, client-side)
// ------------------------------------------------------------------

let idCounter = 0;

export function generateId(): string {
  idCounter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const counter = idCounter.toString(36);
  return `${timestamp}-${random}-${counter}`;
}

// ------------------------------------------------------------------
// Formatters
// ------------------------------------------------------------------

/**
 * Format a number as currency (USD by default).
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/**
 * Format a number with commas (e.g., 1,234,567).
 * Supports optional decimal places.
 */
export function formatNumber(n: number, decimals: number = 0): string {
  if (n >= 1_000_000 && decimals === 0) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000 && n < 1_000_000 && decimals === 0) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format a Date object to a readable string.
 * Default format: "Jan 15, 2026"
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Format a date as "MMM DD" (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  return formatDate(date, { month: "short", day: "numeric" });
}

/**
 * Format a date as "YYYY-MM-DD" for form inputs
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ------------------------------------------------------------------
// Debounce
// ------------------------------------------------------------------

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  return debounced as T;
}

// ------------------------------------------------------------------
// Validation helpers
// ------------------------------------------------------------------

/** Check if a string is a valid email. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Check if a string is non-empty after trimming. */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

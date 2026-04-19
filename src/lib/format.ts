const numberFormatter = new Intl.NumberFormat("fr-FR");
const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatNumber(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n) : n;
  return numberFormatter.format(v ?? 0);
}

export function formatCurrency(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n) : n;
  return currencyFormatter.format(v ?? 0);
}

export function formatRoi(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n) : n;
  if (!v || v <= 0) return "—";
  return `x${v.toFixed(1)}`;
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return dateFormatter.format(new Date(d));
}

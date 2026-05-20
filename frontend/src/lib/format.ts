export function formatCurrency(value: number, currency = "IDR") {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function compactId(value: string, start = 8, end = 6) {
    if (!value) return "-";
    if (value.length <= start + end) return value;
    return `${value.slice(0, start)}...${value.slice(-end)}`;
}
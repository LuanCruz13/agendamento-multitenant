export function startOfToday() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

export function addDays(date: Date, amount: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
}

export function formatWeekdayShort(date: Date) {
    const formatted = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date);
    const withoutDot = formatted.replace(".", "");
    return withoutDot.charAt(0).toUpperCase() + withoutDot.slice(1);
}

export function formatMonthYear(date: Date) {
    const formatted = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatLongDate(date: Date) {
    const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date).replace("-feira", "");
    const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(date);
    return `${weekday}, ${dayMonth}`;
}

export function formatSlotTime(iso: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    }).format(new Date(iso));
}

export function formatSlotRange(iso: string) {
    const start = new Date(iso);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    return `${formatter.format(start)} às ${formatter.format(end)}`;
}

export function toDateParam(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function dayKey(iso: string): string {
    return iso.slice(0, 10);
}

export function nowAsWallClockUtc(): Date {
    const n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes()));
}

export function formatDayLabel(key: string, todayKey: string): { title: string; subtitle: string } {
    const date = new Date(`${key}T00:00:00.000Z`);
    const today = new Date(`${todayKey}T00:00:00.000Z`);
    const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);

    let title: string;
    if (diffDays === 0) {
        title = "Hoje";
    } else if (diffDays === 1) {
        title = "Amanhã";
    } else if (diffDays === -1) {
        title = "Ontem";
    } else {
        const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" })
            .format(date)
            .replace("-feira", "");
        title = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    }

    const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" }).format(date);
    const subtitle = date.getUTCFullYear() === today.getUTCFullYear()
        ? dayMonth
        : `${dayMonth} de ${date.getUTCFullYear()}`;

    return { title, subtitle };
}
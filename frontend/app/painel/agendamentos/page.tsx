"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDayGroup } from "@/components/bookings/booking-day-group";
import { BookingRow } from "@/components/bookings/booking-row";
import { apiFetch } from "@/lib/api";
import { dayKey, formatDayLabel, nowAsWallClockUtc } from "@/lib/dates";

type Booking = {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string | null;
    scheduledAt: string;
    status: "CONFIRMED" | "CANCELLED";
};

function groupByDay(items: Booking[]) {
    const groups = new Map<string, Booking[]>();
    for (const item of items) {
        const key = dayKey(item.scheduledAt);
        const existing = groups.get(key) ?? [];
        existing.push(item);
        groups.set(key, existing);
    }
    return Array.from(groups.entries()).map(([key, items]) => ({ key, items }));
}

export default function AgendamentosPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        async function fetchBookings() {
            const response = await apiFetch("/bookings");
            const data: Booking[] = await response.json();
            setBookings(data);
        }
        fetchBookings();
    }, []);

    const now = nowAsWallClockUtc();
    const todayKey = dayKey(now.toISOString());

    const upcoming = bookings
        .filter((b) => b.status === "CONFIRMED" && new Date(b.scheduledAt) >= now)
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    const past = bookings
        .filter((b) => b.status === "CONFIRMED" && new Date(b.scheduledAt) < now)
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    const cancelled = bookings
        .filter((b) => b.status === "CANCELLED")
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    function renderGroups(items: Booking[], canCancel: boolean) {
        return groupByDay(items).map((group) => {
            const { title, subtitle } = formatDayLabel(group.key, todayKey);
            return (
                <BookingDayGroup key={group.key} title={title} subtitle={subtitle} count={group.items.length}>
                    {group.items.map((booking) => (
                        <BookingRow
                            key={booking.id}
                            id={booking.id}
                            clientName={booking.clientName}
                            clientEmail={booking.clientEmail}
                            clientPhone={booking.clientPhone}
                            scheduledAt={booking.scheduledAt}
                            status={booking.status}
                            canCancel={canCancel}
                            onCancel={() => {}}
                        />
                    ))}
                </BookingDayGroup>
            );
        });
    }

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Agendamentos</h1>
                    <p className="text-pretty text-muted-foreground">
                        Os horários que seus clientes marcaram pelo seu link.
                    </p>
                </div>
                <Button variant="outline" className="h-9 w-fit gap-2 rounded-lg bg-card shadow-xs">
                    <Copy />
                    Copiar link da agenda
                </Button>
            </div>

            <Tabs defaultValue="proximos">
                <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted p-1 sm:inline-flex sm:w-fit">
                    <TabsTrigger value="proximos" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Próximos
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">{upcoming.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="anteriores" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Anteriores
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">{past.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="cancelados" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Cancelados
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">{cancelled.length}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="proximos" className="flex flex-col gap-8 pt-6">
                    {renderGroups(upcoming, true)}
                </TabsContent>

                <TabsContent value="anteriores" className="flex flex-col gap-8 pt-6">
                    {renderGroups(past, false)}
                </TabsContent>

                <TabsContent value="cancelados" className="flex flex-col gap-8 pt-6">
                    {renderGroups(cancelled, false)}
                </TabsContent>
            </Tabs>
        </main>
    );
}

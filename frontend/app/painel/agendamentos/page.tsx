"use client";

import { useEffect, useState } from "react";
import { Copy, Link2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDayGroup } from "@/components/bookings/booking-day-group";
import { BookingRow } from "@/components/bookings/booking-row";
import { apiFetch } from "@/lib/api";
import { dayKey, formatDayLabel, nowAsWallClockUtc } from "@/lib/dates";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getOrganization } from "@/lib/session";
import { toast } from "sonner";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CancelBookingDialog } from "@/components/bookings/cancel-booking-dialog";


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

function wait(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AgendamentosPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [retryKey, setRetryKey] = useState(0);
    const [toCancel, setToCancel] = useState<Booking | null>(null);
    const [cancelPending, setCancelPending] = useState(false);

    const organization = getOrganization();
    const organizationSlug = organization?.slug ?? "";
    const host = typeof window !== "undefined" ? window.location.host : "";

    useEffect(() => {
        let cancelled = false;
    
        async function fetchBookings() {
            setStatus("loading");
            try {
                const response = await apiFetch("/bookings");
                if (cancelled) return;
    
                if (!response.ok) {
                    setStatus("error");
                    return;
                }
    
                const data: Booking[] = await response.json();
                setBookings(data);
                setStatus("ready");
            } catch {
                if (!cancelled) setStatus("error");
            }
        }
    
        fetchBookings();
    
        return () => {
            cancelled = true;
        };
    }, [retryKey]);

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
                            onCancel={() => setToCancel(booking)}
                        />
                    ))}
                </BookingDayGroup>
            );
        });
    }

    function handleRetry() {
        setRetryKey((key) => key + 1);
    }

    async function handleConfirmCancel(){
        if (!toCancel) return
        setCancelPending(true);

        try{
            const [response] = await Promise.all([
                apiFetch(`/bookings/${toCancel.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "CANCELLED" }),
                }),
                wait(2000),
            ]);

            if (response.ok) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === toCancel.id ? { ...b, status: "CANCELLED" } : b))
                );
                setToCancel(null);
                toast.success("Agendamento cancelado. O horário já está livre na sua página.");
                return;
            }

            if (response.status === 404) {
                setToCancel(null);
                toast.error("Esse agendamento não foi encontrado.");
                handleRetry();
                return;
            }

            toast.error("Não foi possível cancelar. Tente novamente.");
        } catch {
            toast.error("Não foi possível cancelar. Tente novamente.");
        } finally {
            setCancelPending(false);
        }

    }

    async function handleCopyLink() {
        const url = `${window.location.origin}/agendar/${organizationSlug}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copiado.");
        } catch {
            toast.error("Não foi possível copiar. Selecione o link e copie manualmente.");
        }
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
                { !(status === "ready" && bookings.length === 0) && (
                    <Button variant="outline" className="h-9 w-fit gap-2 rounded-lg bg-card shadow-xs">
                    <Copy />
                    Copiar link da agenda
                </Button>
                )}
            </div>

            <CancelBookingDialog 
                open={toCancel !== null}
                clientName={toCancel?.clientName ?? ""}
                scheduledAt={toCancel?.scheduledAt ?? ""}
                pending={cancelPending}
                onOpenChange={(open) => !open && !cancelPending && setToCancel(null)}
                onConfirm={handleConfirmCancel}
            />

            

                {status === "loading" && (
                    <div className="flex flex-col gap-8">
                        {[0, 1].map((i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <Skeleton className="h-6 w-48" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-[73px] rounded-2xl" />
                                    <Skeleton className="h-[73px] rounded-2xl" />
                                    <Skeleton className="h-[73px] rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col gap-3">
                        <Alert variant="destructive">
                            <AlertCircle />
                            <AlertDescription>Não foi possível carregar os agendamentos.</AlertDescription>
                        </Alert>
                        <Button variant="outline" size="sm" type="button" onClick={handleRetry} className="self-start">
                            Tentar de novo
                        </Button>
                    </div>
                )}

                {status === "ready" && bookings.length === 0 && (
                    <Empty className="rounded-2xl border border-dashed border-border bg-card px-6 py-14">
                        <EmptyMedia variant="icon">
                            <CalendarPlus />
                        </EmptyMedia>
                        <EmptyTitle className="font-serif text-xl font-semibold tracking-tight">Nenhum agendamento ainda</EmptyTitle>
                        <EmptyDescription>
                            Compartilhe seu link para os clientes escolherem um horário. Os agendamentos aparecem aqui assim que forem feitos.
                        </EmptyDescription>
                        <EmptyContent>
                            <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background p-1.5 pl-3">
                                <Link2 className="size-4 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-left text-sm">
                                    {host}/agendar/<span className="font-medium">{organizationSlug}</span>
                                </span>
                                <Button size="sm" type="button" onClick={handleCopyLink} className="h-8 gap-1.5">
                                    <Copy className="size-4" />
                                    Copiar
                                </Button>
                            </div>
                            <Link href="/painel/disponibilidade" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                                Ainda não definiu seus horários? Configure a disponibilidade
                            </Link>
                        </EmptyContent>
                    </Empty>
                )}


                {status === "ready" && bookings.length > 0 && (
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
                )}

        </main>
    );
}

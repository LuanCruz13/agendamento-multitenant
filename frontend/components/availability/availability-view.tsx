"use client";

import { useEffect, useState } from "react";
import { Plus, Info, AlertCircle, CalendarX2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { WEEK_ORDER, WEEKDAY_LABEL, slotsIn, toHHMM, type Range } from "@/lib/availability";
import { AvailabilityDayRow } from "./availability-day-row";


type ApiAvailability = {
    id: string;
    weekday: number;
    startTime: string;
    endTime: string;
}

export function AvailabilityView() {

    const [ ranges, setRanges] = useState<Range[]>([]);
    const [ status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
    
        async function fetchAvailability() {
            setStatus("loading");
            try {
                const response = await apiFetch("/availability");
                if (cancelled) return;
    
                if (!response.ok) {
                    setStatus("error");
                    return;
                }
    
                const data: ApiAvailability[] = await response.json();
                setRanges(
                    data.map((item) => ({
                        id: item.id,
                        weekday: item.weekday,
                        start: toHHMM(item.startTime),
                        end: toHHMM(item.endTime),
                    }))
                );
                setStatus("ready");
            } catch {
                if (!cancelled) setStatus("error");
            }
        }
    
        fetchAvailability();
    
        return () => {
            cancelled = true;
        };
    }, [retryKey]);


    const horariosPorSemana = ranges.reduce((total, r) => total + slotsIn(r.start, r.end), 0);
    const diasComAtendimento = new Set(ranges.map((r) => r.weekday)).size;


    function handleRetry() {
        setRetryKey((key) => key + 1);
    }

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Disponibilidade</h1>
                    <p className="text-pretty text-muted-foreground">Os dias e horários em que você atende. Vale para todas as semanas.</p>
                </div>
                <Button className="h-9 w-fit gap-2">
                    <Plus />
                    Adicionar horário
                </Button>
            </div>

            {status === "loading" && (
                <>
                    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                        <Skeleton className="h-[74px] rounded-2xl" />
                        <Skeleton className="h-[74px] rounded-2xl" />
                        <Skeleton className="h-[74px] rounded-2xl" />
                    </div>

                    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                        {WEEK_ORDER.map((weekday) => (
                            <li key={weekday} className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:items-center sm:px-5">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-9 w-32 rounded-lg" />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {status === "error" && (
                <div className="flex flex-col gap-3">
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>Não foi possível carregar seus horários.</AlertDescription>
                    </Alert>
                    <Button variant="outline" size="sm" type="button" onClick={handleRetry} className="self-start">
                        Tentar de novo
                    </Button>
                </div>
            )}

            {status === "ready" && (
                <>
                    {ranges.length === 0 ? (
                        <div role="status" className="flex items-start gap-3 rounded-xl border border-accent/50 bg-accent/15 p-4">
                            <CalendarX2 className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold">Sua página ainda não mostra nenhum horário</span>
                                <span className="text-sm text-pretty text-muted-foreground">
                                    Adicione as faixas em que você atende. Assim que salvar a primeira, os clientes já conseguem agendar pelo seu link.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                        <div className="flex flex-col gap-0.5 bg-card px-3 py-3 sm:px-5 sm:py-4">
                            <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">{horariosPorSemana}</span>
                            <span className="text-xs text-muted-foreground sm:text-sm">horários por semana</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-card px-3 py-3 sm:px-5 sm:py-4">
                            <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">{diasComAtendimento}</span>
                            <span className="text-xs text-muted-foreground sm:text-sm">dias com atendimento</span>
                        </div>
                        <div className="flex flex-col gap-0.5 bg-card px-3 py-3 sm:px-5 sm:py-4">
                            <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                                60 min
                            </span>
                            <span className="text-xs text-muted-foreground sm:text-sm">
                                duração de cada horário
                            </span>
                        </div>
                    </div>
                    )}

                    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                        {WEEK_ORDER.map((weekday) => {
                                const DayRanges = ranges
                                    .filter((r) => r.weekday === weekday)
                                    .sort((a, b) => a.start.localeCompare(b.start));

                                return (
                                    <AvailabilityDayRow key={weekday} label={WEEKDAY_LABEL[weekday]} ranges={DayRanges} />
                                );
                        })}
                    </ul>

                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="size-3.5 shrink-0" />
                        Os horários são divididos em atendimentos de 60 minutos, começando no início de cada faixa.
                    </p>
                </>
            )}

               



        </main>
    )
}
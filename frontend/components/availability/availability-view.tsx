"use client";

import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

import { WEEK_ORDER, WEEKDAY_LABEL, slotsIn, type Range } from "@/lib/availability";
import { AvailabilityDayRow } from "./availability-day-row";


const MOCK_RANGES: Range[] = [
    { id: "1", weekday: 1, start: "09:00", end: "12:00" },
    { id: "2", weekday: 1, start: "13:00", end: "18:00" },
    { id: "3", weekday: 2, start: "09:00", end: "12:00" },
    { id: "4", weekday: 3, start: "09:00", end: "12:00" },
    { id: "5", weekday: 3, start: "13:00", end: "18:00" },
    { id: "6", weekday: 4, start: "09:00", end: "12:00" },
    { id: "7", weekday: 5, start: "13:00", end: "17:00" },
    { id: "8", weekday: 6, start: "09:00", end: "12:00" },
];

export function AvailabilityView() {

    const horariosPorSemana = MOCK_RANGES.reduce((total, r) => total + slotsIn(r.start, r.end), 0);
    const diasComAtendimento = new Set(MOCK_RANGES.map((r) => r.weekday)).size;


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

            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {WEEK_ORDER.map((weekday) => {
                        const ranges = MOCK_RANGES
                            .filter((r) => r.weekday === weekday)
                            .sort((a, b) => a.start.localeCompare(b.start));

                        return (
                            <AvailabilityDayRow key={weekday} label={WEEKDAY_LABEL[weekday]} ranges={ranges} />
                        );
                })}
            </ul>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="size-3.5 shrink-0" />
                Os horários são divididos em atendimentos de 60 minutos, começando no início de cada faixa.
            </p>



        </main>
    )
}
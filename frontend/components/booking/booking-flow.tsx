"use client"

import { useState } from "react";
import { DayPicker } from "./day-picker";
import { SlotPicker } from "./slot-picker";
import { StepTitle } from "./step-title";
import { addDays, startOfToday, formatLongDate, formatSlotRange } from "@/lib/dates";
import { CalendarCheck, Clock } from "lucide-react";

type BookingFlowProps = {
    slug: string;
};


export function BookingFlow({ slug }: BookingFlowProps){

        const exampleSlots = [
            "2026-10-14T09:00:00.000Z",
            "2026-10-14T10:00:00.000Z",
            "2026-10-14T11:00:00.000Z",
            "2026-10-14T14:00:00.000Z",
            "2026-10-14T16:00:00.000Z",
            "2026-10-14T17:00:00.000Z",
        ];

        const [weekStart, setWeekStart] = useState(() => startOfToday());
        const [selectedDate, setSelectedDate] = useState(() => startOfToday());
        const [selectedSlot, setSelectedSlot] = useState<string | null>(null);


        function handleSelectedDate(date: Date){
            setSelectedDate(date);
            setSelectedSlot(null);
        }

        function handlePrevWeek(){
            const newWeekStart = addDays(weekStart, -7);
            setWeekStart(newWeekStart);
            setSelectedDate(newWeekStart);
            setSelectedSlot(null);
        }

        function handleNextWeek(){
            const newWeekStart = addDays(weekStart, 7);
            setWeekStart(newWeekStart);
            setSelectedDate(newWeekStart);
            setSelectedSlot(null);
        }

        const longDate = formatLongDate(selectedDate);
        const capitalizedLongDate = longDate.charAt(0).toUpperCase() + longDate.slice(1);

    return( 
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
            <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-xl font-semibold text-primary-foreground">
                    SB
                </span>
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">Studio Bela</h1>
                    <p className="text-pretty text-muted-foreground">
                        Escolha um dia e um horário livre. Cada atendimento dura 60 minutos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_22rem]">
                <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 md:p-6">
                    <DayPicker 
                        weekStart={weekStart}
                        selectedDate={selectedDate}
                        onSelectDate={handleSelectedDate}
                        onPrevWeek={handlePrevWeek}
                        onNextWeek={handleNextWeek}
                    />
                    <div className="h-px bg-border" />
                    
                    <SlotPicker
                        selectedDate={selectedDate}
                        slots={exampleSlots}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                    />
                </section>

                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6 lg:sticky lg:top-6">
                    <StepTitle number={3} id="step-form">Seus dados</StepTitle>

                {selectedSlot ? (
                        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <CalendarCheck className="size-4" />
                            </span>
                            <div className="flex flex-col">
                            <span className="text-sm font-medium">{capitalizedLongDate}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatSlotRange(selectedSlot)} · Studio Bela
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Clock className="size-4" />
                        </span>
                        Escolha um dia e um horário para continuar.
                    </div>     
                    )}




                </section>
            </div>
            
        </main>
    )
}
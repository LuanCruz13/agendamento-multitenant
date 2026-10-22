"use client"

import { useEffect, useState } from "react";
import { DayPicker } from "./day-picker";
import { SlotPicker } from "./slot-picker";
import { BookingNotFound } from "./booking-not-found";
import { addDays, startOfToday, toDateParam } from "@/lib/dates";
import { BookingForm } from "./booking-form";
import { getInitials } from "@/lib/initials";
import { slugToName } from "@/lib/slug";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";


type BookingFlowProps = {
    slug: string;
};


export function BookingFlow({ slug }: BookingFlowProps){

        const orgName = slugToName(slug);

        const [weekStart, setWeekStart] = useState(() => startOfToday());
        const [selectedDate, setSelectedDate] = useState(() => startOfToday());
        const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
        const [status, setStatus] = useState<"loading" | "ready" | "error" | "not-found">("loading")
        const [slots, setSlots] = useState<string[]>([]);
        const [retryKey, setRetryKey] = useState(0);

        

        useEffect(() => {
            let cancelled = false;

            async function fetchSlots(){
                setStatus("loading");
                setSelectedSlot(null);

                try{
                    const response = await fetch(
                        `${API_URL}/public/${slug}/slots?date=${toDateParam(selectedDate)}`
                    );

                    if (cancelled) return;

                    if (response.status === 404){
                        setStatus("not-found");
                        return;
                    }

                    if(!response.ok){
                        setStatus("error");
                        return;
                    }

                    const data: string[] = await response.json();
                    setSlots(data);
                    setStatus("ready");
                } catch {
                    if (!cancelled) setStatus("error");
                }
            }

            fetchSlots();

            return () => {
                cancelled = true;
            };
        }, [slug, selectedDate, retryKey]);


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

        function handleRetry(){
            setRetryKey((key) => key + 1);
        }

        function handleBookingConflict(){
            setSelectedSlot(null);
            handleRetry();
        }

        if (status === "not-found"){
            return <BookingNotFound />;
        }

    return( 
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
            <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-xl font-semibold text-primary-foreground">
                    {getInitials(orgName)}
                </span>
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">{orgName}</h1>
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
                        status={status}
                        selectedDate={selectedDate}
                        slots={slots}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                        onNextWeek={handleNextWeek}
                        onRetry={handleRetry}
                    />
                </section>

                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6 lg:sticky lg:top-6">
                    <BookingForm
                        slug={slug}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        organizationName={orgName}
                        onBookingConflict={handleBookingConflict}
                    />
                </section>

                
            </div>
            
        </main>
    )
}
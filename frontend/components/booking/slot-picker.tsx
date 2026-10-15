"use client";

import { AlertCircle, ArrowRight, CalendarX2, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { StepTitle } from "./step-title";
import { formatLongDate, formatSlotTime } from "@/lib/dates";

type SlotPickerProps = {
    status: "loading" | "ready" | "error" | "not-found";
    selectedDate: Date;
    slots: string[];
    selectedSlot: string | null;
    onSelectSlot: (slot: string) => void;
    onNextWeek: () => void;
    onRetry: () => void;
};

export function SlotPicker({ status, selectedDate, slots, selectedSlot, onSelectSlot, onNextWeek, onRetry }: SlotPickerProps) {

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <StepTitle number={2} id="step-slot">Escolha o horário</StepTitle>
                <span className="text-sm text-muted-foreground">{formatLongDate(selectedDate)}</span>
            </div>

            {status === "loading" && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {Array.from({ length: 6}, (_, index) => (
                        <Skeleton key={index} className="h-11 rounded-lg" /> 
                    ))}
                </div>
            )}

            {status === "error" && (
                <>
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>Não foi possível carregar os horários. Tente novamente.</AlertDescription>
                    </Alert>
                    <Button variant="outline" size="sm" type="button" onClick={onRetry} className="self-start">
                        Tentar de novo
                    </Button>
                </>
            )}

            {status === "ready" && slots.length === 0 && (
                <Empty className="rounded-xl border border-dashed border-border py-10">
                    <EmptyMedia variant="icon">
                        <CalendarX2 />
                    </EmptyMedia>
                    <EmptyTitle>Nenhum horário livre neste dia</EmptyTitle>
                    <EmptyDescription>Escolha outro dia para ver os horários disponíveis.</EmptyDescription>
                    <EmptyContent>
                        <Button variant="outline" size="sm" type="button" onClick={onNextWeek}>
                            Ver próxima semana
                            <ArrowRight className="size-4" />
                        </Button>
                    </EmptyContent>
                </Empty>
            )}

            {status === "ready" && slots.length > 0 && (
                <div role="group" aria-label="Horários livres" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => {
                        const isSelected = slot === selectedSlot;

                        return (
                            <Button
                                key={slot}
                                type="button"
                                variant="outline"
                                aria-pressed={isSelected}
                                onClick={() => onSelectSlot(slot)}
                                className={
                                    isSelected
                                        ? "h-11 rounded-lg border-accent bg-accent text-sm font-medium text-accent-foreground hover:bg-accent/90"
                                        : "h-11 rounded-lg border-border bg-background text-sm font-medium"
                                }
                            >
                                {isSelected && <Check className="size-4" />}
                                {formatSlotTime(slot)}
                            </Button>
                        );
                    })}
             </div>
            )}
            
        </div>
    );
}
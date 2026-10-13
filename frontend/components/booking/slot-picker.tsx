"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepTitle } from "./step-title";
import { formatLongDate, formatSlotTime } from "@/lib/dates";

type SlotPickerProps = {
    selectedDate: Date;
    slots: string[];
    selectedSlot: string | null;
    onSelectSlot: (slot: string) => void;
};

export function SlotPicker({ selectedDate, slots, selectedSlot, onSelectSlot }: SlotPickerProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <StepTitle number={2} id="step-slot">Escolha o horário</StepTitle>
                <span className="text-sm text-muted-foreground">{formatLongDate(selectedDate)}</span>
            </div>

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
        </div>
    );
}
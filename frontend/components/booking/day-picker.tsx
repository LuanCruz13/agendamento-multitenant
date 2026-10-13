"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepTitle } from "./step-title";
import { addDays, formatMonthYear, formatWeekdayShort, startOfToday } from "@/lib/dates";


type DayPickerProps = {
    weekStart: Date;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onPrevWeek: () => void;
    onNextWeek: () => void;
}

export function DayPicker({ weekStart, selectedDate, onSelectDate, onPrevWeek, onNextWeek }: DayPickerProps){
    const days = Array.from({ length: 7}, (_, index) => addDays(weekStart, index));
    const isPrevWeekDisabled = weekStart.getTime() <= startOfToday().getTime();

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <StepTitle number={1} id="step-day">Escolha o dia</StepTitle>
                <div className="flex items-center gap-1">
                    <span className="mr-1 hidden text-sm text-muted-foreground sm:inline">
                        {formatMonthYear(weekStart)}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="size-8 rounded-lg"
                        onClick={onPrevWeek}
                        disabled={isPrevWeekDisabled}
                        aria-label="Semana anterior"
                    >
                        <ChevronLeft/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="size-8 rounded-lg"
                        onClick={onNextWeek}
                        aria-label="Próxima semana"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            <div role="group" aria-label="Dias" className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {days.map((day) => {
                    const isSelected = day.getTime() === selectedDate.getTime();

                    return (
                        <Button
                            key={day.toISOString()}
                            type="button"
                            variant="outline"
                            aria-pressed={isSelected}
                            onClick={ () => onSelectDate(day)}
                            className={
                                isSelected
                                    ? "h-auto flex-col gap-0.5 rounded-lg border-primary bg-primary py-2 text-xs font-normal text-primary-foreground hover:bg-primary/90"
                                    : "h-auto flex-col gap-0.5 rounded-lg border-border bg-background py-2 text-xs font-normal"
                            }
                        >
                            <span className={isSelected ? "opacity-80" : "text-muted-foreground"}>
                                {formatWeekdayShort(day)}
                            </span>
                            <span className="text-base font-semibold">{day.getDate()}</span>
                        </Button>
                    )
                })}
            </div>


        </div>
    )



}


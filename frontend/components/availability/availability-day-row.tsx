import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvailabilityChip } from "@/components/availability/availability-chip";
import { slotsIn, type Range } from "@/lib/availability";

type AvailabilityDayRowProps = {
    label: string;
    ranges: Range[];
    weekday: number;
    onAddClick: (weekday: number) => void;
    onEditClick: (range: Range) => void;
    onRemoveClick: (range: Range) => void;
};

export function AvailabilityDayRow({ label, ranges, weekday, onAddClick, onEditClick, onRemoveClick  }: AvailabilityDayRowProps){

    const totalSlots = ranges.reduce((total, r) => total + slotsIn(r.start, r.end), 0);
    const meta = totalSlots === 0 ? "Sem atendimento" : totalSlots === 1 ? "1 horário" : `${totalSlots} horários`;

    return (
        <li className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:items-center sm:px-5">
            <div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-0.5">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs text-muted-foreground">{meta}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {ranges.map((range) => (
                    <AvailabilityChip key={range.id} range={range} dayLabel={label} onEditClick={onEditClick} onRemoveClick={onRemoveClick} />
                ))}

                <Button
                    variant="outline"
                    className="h-9 gap-1.5 border-dashed px-3 text-muted-foreground"
                    aria-label={`Adicionar horário na ${label.toLowerCase()}`}
                    onClick={() => onAddClick(weekday)}
                >
                    <Plus/>
                        Adicionar
                </Button>
            </div>
        </li>
    )
}
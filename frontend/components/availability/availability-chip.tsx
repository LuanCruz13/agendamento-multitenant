import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Range } from "@/lib/availability";

type AvailabilityChipProps = {
    range: Range;
    dayLabel: string;
};

export function AvailabilityChip({ range, dayLabel }: AvailabilityChipProps){
    const dayLower = dayLabel.toLowerCase();

    return (
        <div className="inline-flex h-9 items-center gap-0.5 rounded-lg border border-border bg-background pr-1 pl-3 text-sm font-medium tabular-nums">
            {range.start} – {range.end}

            <Button
                 variant="ghost"
                 size="icon"
                 className="ml-1.5 size-7 text-muted-foreground hover:text-foreground"
                 aria-label={`Editar ${dayLower}, ${range.start} às ${range.end}`}
            >
                <Pencil className="size-3.5" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remover ${dayLower}, ${range.start} às ${range.end}`}
            >
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    )
}
import { Mail, Phone, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSlotTime } from "@/lib/dates";

type BookingRowProps = {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string | null;
    scheduledAt: string;
    status: "CONFIRMED" | "CANCELLED";
    canCancel: boolean;
    onCancel: () => void;
};

export function BookingRow({ id, clientName, clientEmail, clientPhone, scheduledAt, status, canCancel, onCancel }: BookingRowProps) {
    const isCancelled = status === "CANCELLED";

    return (
        <li className="grid grid-cols-[3.75rem_1fr] items-center gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[4.5rem_1fr_auto] sm:px-5">
            <span className={isCancelled ? "text-base font-semibold tabular-nums text-muted-foreground line-through" : "text-base font-semibold tabular-nums text-primary"}>
                {formatSlotTime(scheduledAt)}
            </span>

            <div className="flex min-w-0 flex-col gap-1">
                <span className={isCancelled ? "truncate text-sm font-medium text-muted-foreground" : "truncate text-sm font-medium"}>
                    {clientName}
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {clientEmail}
                    </span>
                    {clientPhone && (
                        <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5" />
                            {clientPhone}
                        </span>
                    )}
                </div>
            </div>

            <div className="col-start-2 flex items-center justify-between gap-2 sm:col-start-auto sm:justify-end">
                {isCancelled ? (
                    <Badge className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Cancelado
                    </Badge>
                ) : (
                    <Badge className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Confirmado
                    </Badge>
                )}

                {canCancel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={onCancel}
                        className="h-8 gap-1.5 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Cancelar agendamento de ${clientName} às ${formatSlotTime(scheduledAt)}`}
                    >
                        <X className="size-4" />
                        Cancelar
                    </Button>
                )}
            </div>
        </li>
    );
}

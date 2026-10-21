import { CalendarX2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatSlotRange, formatWeekdayDate } from "@/lib/dates";

type CancelBookingDialogProps = {
  open: boolean;
  clientName: string;
  scheduledAt: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CancelBookingDialog({
  open,
  clientName,
  scheduledAt,
  onOpenChange,
  onConfirm,
}: CancelBookingDialogProps) {

    const summary = scheduledAt ? `${formatWeekdayDate(scheduledAt)} · ${formatSlotRange(scheduledAt)}` : "";


  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md gap-5 rounded-2xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-xl font-semibold tracking-tight">
            Cancelar este agendamento?
          </AlertDialogTitle>
          <AlertDialogDescription>
            O horário volta a ficar livre na sua página de agendamento. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarX2 className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{clientName}</span>
            <span className="text-xs text-muted-foreground">
              {summary}
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Manter agendamento</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Cancelar agendamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

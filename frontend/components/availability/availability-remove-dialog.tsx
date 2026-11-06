import { CalendarClock } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { slotsIn, WEEKDAY_LABEL, type Range } from "@/lib/availability";

type AvailabilityRemoveDialogProps = {
    open: boolean;
    range: Range | null;
    pending: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
  };



  export function AvailabilityRemoveDialog({ open, range, pending, onOpenChange, onConfirm}: AvailabilityRemoveDialogProps){
    const totalSlots = range ? slotsIn(range.start, range.end) : 0;
    const summary = range
        ? `${range.start} - ${range.end} · ${totalSlots === 1 ? "1 horário" : `${totalSlots} horários`}`
        : ""

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md gap-5 rounded-2xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-semibold tracking-tight">
              Remover este horário?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Os clientes deixam de ver essa faixa na sua página. Agendamentos já marcados nela continuam valendo.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarClock className="size-4" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{range ? WEEKDAY_LABEL[range.weekday] : ""}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{summary}</span>
            </div>
          </div>
  
          <AlertDialogFooter>
            <AlertDialogCancel>Manter horário</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onConfirm}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Spinner />
                  Removendo...
                </>
              ) : (
                "Remover horário"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )


  }
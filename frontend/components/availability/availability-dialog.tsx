import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Controller ,useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeAvailabilitySchema } from "@/lib/validations/availability";
import { WEEK_ORDER, WEEKDAY_LABEL, slotsIn, slotLabels, toHHMM, toISO, type Range} from "@/lib/availability";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CalendarClock, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";




type AvailabilityDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    existing: Range[];
    editing?: Range;
    defaultWeekday?: number;
    onSaved: (range: Range) => void;
};

const START_HOURS: string[] = [];
for (let h = 0; h < 24; h++){
    START_HOURS.push(`${String(h).padStart(2, "0")}:00`);
}

const END_HOURS = START_HOURS.slice(1);

export function AvailabilityDialog({ open, onOpenChange, existing, editing, defaultWeekday, onSaved }: AvailabilityDialogProps) {
    const form = useForm({
        resolver: zodResolver(makeAvailabilitySchema(existing, editing?.id)),
        defaultValues: {
            weekday: editing?.weekday ?? defaultWeekday ?? 1,
            start: editing?.start ?? "",
            end: editing?.end ?? "",
        },
    });

    useEffect(() => {
        if (open){
            form.reset({
                weekday: editing?.weekday ?? defaultWeekday ?? 1,
                start: editing?.start ?? "",
                end: editing?.end ?? "",
            });
        }
    }, [open, editing, defaultWeekday]);

    const { errors } = form.formState;
    const [pending, setPending] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const start = form.watch("start");
    const end = form.watch("end");
    const totalSlots = start && end ? slotsIn(start, end) : 0;
    const showPreview = totalSlots > 0;

    async function onSubmit(values: { weekday: number, start: string; end: string}){
        setFormError(null);
        setPending(true);

        try{
            const body = JSON.stringify({
                weekday: values.weekday,
                startTime: toISO(values.start),
                endTime: toISO(values.end),
            });

            const response = editing
                    ? await apiFetch(`/availability/${editing.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json"},
                        body,
                    })
                :   await apiFetch("/availability", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body
                });

                if (!response.ok) {
                    if (response.status === 404 && editing) {
                        toast.error("Esse horário não foi encontrado.");
                        onOpenChange(false);
                        return;
                    }
                    setFormError(
                        response.status === 400
                            ? "Confira os horários e tente de novo."
                            : "Não foi possível salvar. Tente novamente."
                    );
                    return;
                }
                    
                const data = await response.json();
                onSaved({
                    id: data.id,
                    weekday: data.weekday,
                    start: toHHMM(data.startTime),
                    end: toHHMM(data.endTime),
                });
                onOpenChange(false);
                toast.success(editing ? "Horário atualizado." : "Horário adicionado.");
        } catch {
            setFormError("Não foi possível salvar. Tente novamente.");
        } finally {
            setPending(false);
        }
    }
    

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md gap-5 rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:translate-y-0 max-sm:max-w-full max-sm:rounded-b-none">
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
                        {editing ? "Editar horário" : "Adicionar horário"}
                    </DialogTitle>
                    <DialogDescription>A faixa vale para todas as semanas.</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <Controller
                            control={form.control}
                            name="weekday"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor="weekday">Dia da semana</FieldLabel>
                                    <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                                        <SelectTrigger id="weekday" className="h-11 w-full rounded-lg bg-card text-base shadow-xs md:text-sm">
                                            <SelectValue>{(value: string) => WEEKDAY_LABEL[Number(value)]}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WEEK_ORDER.map((weekday) => (
                                                <SelectItem key={weekday} value={String(weekday)}>
                                                    {WEEKDAY_LABEL[weekday]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Controller 
                                control={form.control}
                                name="start"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={!!fieldState.error}>
                                        <FieldLabel htmlFor="start">Início</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="start" aria-invalid={!!(errors.start || errors.end)} className="h-11 w-full rounded-lg bg-card text-base shadow-xs md:text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {START_HOURS.map((hour) => (
                                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />

                            <Controller 
                                control={form.control}
                                name="end"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={!!fieldState.error}>
                                        <FieldLabel htmlFor="end">Fim</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="end" aria-invalid={!!(errors.start || errors.end)}  className={"h-11 w-full rounded-lg bg-card text-base shadow-xs md:text-sm"}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {END_HOURS.map((hour) => (
                                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                        </div>

                        <FieldError errors={[errors.start ?? errors.end]} />

                        {showPreview && (
                            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                                <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm">
                                        Seus clientes vão ver{" "}
                                        <span className="font-medium">
                                            {totalSlots === 1 ? "1 horário" : `${totalSlots} horários`}
                                        </span>{" "}
                                        de 60 min:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {slotLabels(start, end).map((label) => (
                                            <span key={label} className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {formError && (
                            <Alert variant="destructive">
                                <AlertCircle />
                                <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={pending}>
                                {pending ? (
                                    <>
                                        <Spinner />
                                        Salvando...
                                    </>
                                ) : (
                                    "Salvar horário"
                                )}
                            </Button>
                        </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    )
}
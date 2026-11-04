import { Controller ,useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeAvailabilitySchema } from "@/lib/validations/availability";
import { WEEK_ORDER, WEEKDAY_LABEL, type Range } from "@/lib/availability";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

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

    const { errors } = form.formState;

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md gap-5 rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:translate-y-0 max-sm:max-w-full max-sm:rounded-b-none">
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
                        {editing ? "Editar horário" : "Adicionar horário"}
                    </DialogTitle>
                    <DialogDescription>A faixa vale para todas as semanas.</DialogDescription>
                </DialogHeader>

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

            </DialogContent>
        </Dialog>
    )
}
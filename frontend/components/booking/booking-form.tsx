import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { StepTitle } from "./step-title";
import { formatLongDate, formatSlotRange } from "@/lib/dates";

const controlClass = "bg-card"

const bookingSchema = z.object({
    name: z.string().trim().min(1, "Informe seu nome.").max(80, "Use no máximo 80 caracteres."),
    email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
    phone: z.string().trim().refine(
        (value) => value === "" || /^\d{10,11}$/.test(value.replace(/\D/g, "")),
        "Telefone inválido. Use DDD + número."
    ),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingFormProps = {
    selectedDate: Date;
    selectedSlot: string | null;
    organizationName:string;
};

export function BookingForm({ selectedDate, selectedSlot, organizationName}: BookingFormProps) {
    
    const { control, handleSubmit } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { name: "", email: "", phone: ""},
    });

    const longDate = formatLongDate(selectedDate);
    const capitalizedLongDate = longDate.charAt(0).toUpperCase() + longDate.slice(1);

    function onSubmit(values: BookingFormValues){
        console.log(values);
    }
    
    return (
        <>
            <StepTitle number={3} id="step-form" >
                Seus Dados
            </StepTitle>
            
            {selectedSlot ? (
                <div className="flex min-h-14 items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CalendarCheck className="size-4" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{capitalizedLongDate}</span>
                        <span className="text-xs text-muted-foreground">{formatSlotRange(selectedSlot)} · {organizationName}</span>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-14 items-center gap-3 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Clock className="size-4" />
                    </span>
                    Escolha um dia e um horário para continuar.
                </div>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FieldGroup className="gap-5">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState}) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel htmlFor="name" className="text-foreground">
                                    Seu Nome
                                </FieldLabel>
                                <Input 
                                    {...field}
                                    id="name"
                                    autoComplete="name"
                                    placeholder="nome e sobrenome"
                                    className={cn(controlClass, "rounded-lg")}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState}) => (
                            <Field>
                                <FieldLabel htmlFor="email" className="text-foreground">E-mail</FieldLabel>
                                    <Input 
                                        {...field}
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="voce@email.com"
                                        className={cn(controlClass, "rounded-lg")}
                                    />
                                    <FieldError errors={[fieldState.error]} />
                                    {!fieldState.error && (
                                        <FieldDescription className="text-xs">
                                            A confirmação chega neste e-mail
                                        </FieldDescription>
                                    )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState}) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel htmlFor="phone" className="text-foreground">
                                    Telefone <span>(opcional)</span>
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="phone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    placeholder="(65) 9999-0000"
                                    className={cn(controlClass, "rounded-lg")}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button type="submit" size="lg" className="mt-1 h-11 w-full text-base" disabled={!selectedSlot}>
                    Confirmar agendamento
                </Button>

                <p className="text-center text-xs text-pretty text-muted-foreground">
                    Não é preciso criar conta. Você recebe a confirmação por e-mail.
                </p>
            </form>
        </>
    );
}
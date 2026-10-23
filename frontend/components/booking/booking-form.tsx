import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CalendarCheck, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { StepTitle } from "./step-title";
import { formatLongDate, formatSlotRange } from "@/lib/dates";
import { Spinner } from "@/components/ui/spinner";


const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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
    slug: string;
    selectedDate: Date;
    selectedSlot: string | null;
    organizationName:string;
    onBookingConflict: () => void;
};

export function BookingForm({ slug, selectedDate, selectedSlot, organizationName, onBookingConflict}: BookingFormProps) {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (selectedSlot){
            setFormError(null)
        }
    }, [selectedSlot]);

    
    const { control, handleSubmit } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { name: "", email: "", phone: ""},
    });

    const longDate = formatLongDate(selectedDate);
    const capitalizedLongDate = longDate.charAt(0).toUpperCase() + longDate.slice(1);

    async function onSubmit(values: BookingFormValues){
        if(!selectedSlot) return;

        setFormError(null);
        setPending(true);

        try{
            const response = await fetch(`${API_URL}/public/${slug}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName: values.name,
                    clientEmail: values.email,
                    clientPhone: values.phone || undefined,
                    scheduledAt: selectedSlot,
                }),
            });

            if(!response.ok){
                if (response.status === 409){
                    setFormError("Esse horário acabou de ser reservado por outra pessoa. Os horários foram atualizados: escolha outro.");
                    onBookingConflict();
                } else if (response.status === 400){
                    setFormError("Esse horário não está mais disponível. Escolha outro.")
                } else if (response.status === 429){
                    setFormError('Muitas tentativas. Aguarde um minuto e tente de novo.');
                } else {
                    setFormError("Algo deu errado. Tente novamente.");
                }
                return;
            }
            router.push(`/agendar/${slug}/confirmado?horario=${encodeURIComponent(selectedSlot)}&nome=${encodeURIComponent(values.name)}&email=${encodeURIComponent(values.email)}`);
        } catch {
            setFormError("Não foi possível conectar ao servidor. Verifique sua conexão e tente de novo.");
        } finally {
            setPending(false);
        }
    }
    
    return (
        <>
            <StepTitle number={3} id="step-form" >
                Seus Dados
            </StepTitle>

            {formError && (
                <Alert variant="destructive" className="border-destructive/25 bg-destructive/5">
                    <AlertCircle />
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            )}
            
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
                                    Seu nome
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
                                    Telefone<span className="font-normal text-muted-foreground">(opcional)</span>
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

                <Button type="submit" size="lg" className="mt-1 h-11 w-full text-base" disabled={!selectedSlot || pending}>
                    {pending ? (
                        <>
                            <Spinner />
                            Confirmando...
                        </>
                    ): (
                        "Confirmar Agendamento"
                    )}
                </Button>

                <p className="text-center text-xs text-pretty text-muted-foreground">
                    Não é preciso criar conta. Você recebe a confirmação por e-mail.
                </p>
            </form>
        </>
    );
}
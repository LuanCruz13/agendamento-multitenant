"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";

const forgotPasswordSchema = z.object({
    email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const [pending, setPending] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values: ForgotPasswordValues) {
        setFormError(null);
        setPending(true);

        try {
            console.log(values);
        } finally {
            setPending(false);
        }
    }

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {formError && (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            )}

            <FieldGroup className="gap-5">
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                            <FieldLabel htmlFor="email" className="text-foreground">E-mail</FieldLabel>
                            <Input
                                {...field}
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="voce@seunegocio.com"
                                className={cn(controlClass, "rounded-lg")}
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button type="submit" size="lg" className="mt-1 h-11 text-base" disabled={pending}>
                {pending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    "Enviar link"
                )}
            </Button>
        </form>
    );
}

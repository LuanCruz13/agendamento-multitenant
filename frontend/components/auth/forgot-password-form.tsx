"use client";

import { useResendCooldown } from "@/lib/use-resend-cooldown";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const RESEND_COOLDOWN = 45;

const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";

const forgotPasswordSchema = z.object({
    email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const [pending, setPending] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");
    const {cooldown, start: startCooldown} = useResendCooldown(RESEND_COOLDOWN);

    const { control, handleSubmit } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    async function requestReset(email: string) {
        setFormError(null);
        setPending(true);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    setFormError("Muitas tentativas. Aguarde um minuto e tente de novo.");
                } else {
                    setFormError("Algo deu errado. Tente novamente.");
                }
                return;
            }

            setSentEmail(email);
            setSent(true);
            startCooldown();
        } catch {
            setFormError("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        } finally {
            setPending(false);
        }
    }

    async function onSubmit(values: ForgotPasswordValues) {
        await requestReset(values.email);
    }

    function handleResend() {
        if (cooldown > 0 || pending) return;
        requestReset(sentEmail);
    }

    if (sent) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <MailCheck className="size-5 text-foreground" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                        Verifique seu e-mail
                    </h1>
                    <p className="text-pretty text-muted-foreground">
                        Se existir uma conta com <span className="font-medium text-foreground">{sentEmail}</span>, você vai receber um link para criar uma nova senha. O link vale por 1 hora.
                    </p>
                </div>

                {formError && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col gap-1 rounded-lg border border-border p-4">
                    <span className="text-sm font-medium">Não chegou?</span>
                    <p className="text-sm text-muted-foreground">
                        Confira a caixa de spam ou peça um novo link.
                    </p>
                    {cooldown > 0 ? (
                        <span className="text-sm text-muted-foreground">
                            Reenviar em 0:{String(cooldown).padStart(2, "0")}
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={pending}
                            className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
                        >
                            Reenviar link
                        </button>
                    )}
                </div>

                <Button render={<Link href="/login" />} variant="outline" nativeButton={false} className="h-11 gap-2 text-base">
                    <ArrowLeft className="size-4" />
                    Voltar para o login
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" />
                Voltar para o login
            </Link>

            <div className="flex flex-col gap-2">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    Esqueceu a senha?
                </h1>
                <p className="text-pretty text-muted-foreground">
                    Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
                </p>
            </div>

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

            <p className="text-sm text-muted-foreground">
                Lembrou a senha?{" "}
                <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Entrar
                </Link>
            </p>
        </div>
    );
}

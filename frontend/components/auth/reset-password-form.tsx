// frontend/components/auth/reset-password-form.tsx (substitui o arquivo inteiro)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Link2Off, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
        confirmPassword: z.string().min(1, "Confirme a nova senha."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [invalidLink, setInvalidLink] = useState(false);

    useEffect(() => {
        if (!token) {
            setInvalidLink(true);
        }
    }, [token]);

    const { control, handleSubmit } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    async function onSubmit(values: ResetPasswordValues) {
        if (!token) return;

        setFormError(null);
        setPending(true);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: values.password }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    setInvalidLink(true);
                } else {
                    setFormError("Algo deu errado. Tente novamente.");
                }
                return;
            }

            router.push("/login?resetSenha=sucesso");
        } catch {
            setFormError("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        } finally {
            setPending(false);
        }
    }

    if (invalidLink) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                    <Link2Off className="size-5 text-destructive" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                        Este link não vale mais
                    </h1>
                    <p className="text-pretty text-muted-foreground">
                        Links para redefinir a senha valem por 1 hora e só podem ser usados uma vez. Peça um novo link para continuar.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button render={<Link href="/esqueci-senha" />} size="lg" nativeButton={false} className="h-11 text-base">
                        Pedir um novo link
                    </Button>
                    <Button render={<Link href="/login" />} variant="outline" size="lg" nativeButton={false} className="h-11 gap-2 text-base">
                        Voltar para o login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    Crie uma nova senha
                </h1>
                <p className="text-pretty text-muted-foreground">
                    Escolha uma senha nova para entrar no painel da sua organização.
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
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel htmlFor="password" className="text-foreground">Nova senha</FieldLabel>
                                <InputGroup className={cn(controlClass, "rounded-lg")}>
                                    <InputGroupInput
                                        {...field}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Mínimo de 8 caracteres"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-xs"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.error ? (
                                    <FieldError errors={[fieldState.error]} />
                                ) : (
                                    <FieldDescription className="text-xs">
                                        Use pelo menos 8 caracteres.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel htmlFor="confirmPassword" className="text-foreground">Confirme a nova senha</FieldLabel>
                                <InputGroup className={cn(controlClass, "rounded-lg")}>
                                    <InputGroupInput
                                        {...field}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Repita a senha"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-xs"
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                                            aria-pressed={showConfirmPassword}
                                        >
                                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button type="submit" size="lg" className="mt-1 h-11 text-base" disabled={pending}>
                    {pending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        "Salvar nova senha"
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

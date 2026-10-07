"use client";

import { useRouter } from "next/navigation";
import { useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const inputClass = 
    "h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15 md:text-sm"


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

const loginSchema = z.object({
    email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
    password: z.string().min(1, "Informe sua senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>



export function LoginForm(){

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginFormValues){
        setFormError(null);
        setPending(true);

        try{
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(values),
            });

            if (!response.ok){
                if(response.status === 401){
                    setFormError("E-mail ou senha incorretos.");
                } else if (response.status === 429){
                    setFormError("Muitas tentativas. Aguarde um minuto e tente de novo.")
                } else {
                    setFormError("Algo deu errado. Tente novamente. ");
                }
                return;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            router.push("/painel");
        } catch {
            setFormError("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        } finally {
            setPending(false);
        }
    }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {formError && (
            <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
            >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{formError}</p>
            </div>
        )}
            <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
                E-mail
            </label>
            <input 
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@seunegocio.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass}
                {...register("email")}
            />
            {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                    {errors.email.message}
                </p>
            )}
            </div>

            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                    Senha
                </label>

                <a 
                    href="#"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                    Esqueceu a senha?
                </a>
            </div>

            <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`${inputClass} pr-11`}
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
                
                >
                    {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4" />}
                </button>
            </div>
            {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                    {errors.password.message}
                </p>
            )}
            </div>

            <Button type="submit" size="lg" className="mt-1 h-11 text-base" disabled={pending}>
                {pending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Entrando...
                    </>
                ) : (
                    "Entrar"
                )}
            </Button>
    </form>
  );
}

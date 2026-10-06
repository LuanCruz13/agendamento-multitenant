"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const inputClass = 
    "h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/15 md:text-sm"


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm(){

    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string}>({});

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        const formData = new FormData (event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        const errors: { 
            email?: string;
            password?: string
        } = {};

        if (!email){
            errors.email = "Informe seu e-mail.";
        } else if (!EMAIL_PATTERN.test(email)){
            errors.email = "E-mail inválido."
        }

        if(!password){
            errors.password = "Informe sua senha."
        }

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0){
            return;
        }



    }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
                E-mail
            </label>
            <input 
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@seunegocio.com"
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={inputClass}
            />
            {fieldErrors.email && (
                <p id="email-error" className="text-sm text-destructive">
                    {fieldErrors.email}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    aria-invalid={fieldErrors.password ? true : undefined}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    className={`${inputClass} pr-11`}
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
            {fieldErrors.password && (
                <p id="password-error" className="text-sm text-destructive">
                    {fieldErrors.password}
                </p>
            )}
        </div>

        <Button type="submit" size="lg" className="mt-1 h-11 text-base">
            Entrar
        </Button>




    </form>
  );
}

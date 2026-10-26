import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/landing/logo";
import { AuthAside } from "@/components/auth/auth-aside";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
    title: "Esqueci minha senha | Agendaí",
    description: "Redefina a senha da sua conta Agendaí.",
};

export default function EsqueciSenhaPage(){
    return(
        <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
            <main className="flex flex-col px-4 py-6 md:px-10">
                <header>
                    <Link href="/" aria-label="Agendaí, página inicial" className="w-fit">
                        <Logo />
                    </Link>
                </header>    

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="flex w-full max-w-sm flex-col gap-8">
                        <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="size-4" />
                            Voltar para o login
                        </Link>

                        <div className="flex flex-col gap-2">
                            <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">Esqueceu a senha?</h1>
                            <p className="text-pretty text-muted-foreground">Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.</p>
                        </div>

                        <ForgotPasswordForm/>

                        <p className="text-sm text-muted-foreground">
                            Lembrou a senha?{" "}
                            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>

            <footer className="text-xs text-muted-foreground">© 2026 Agendaí</footer>
            </main>
            <AuthAside/>
        </div>
    )
}

import type { Metadata } from "next"
import Link from "next/link"
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
                        <ForgotPasswordForm/>
                    </div>
                </div>

            <footer className="text-xs text-muted-foreground">© 2026 Agendaí</footer>
            </main>
            <AuthAside/>
        </div>
    )
}

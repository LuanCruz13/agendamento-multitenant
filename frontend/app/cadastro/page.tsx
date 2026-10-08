import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/landing/logo";
import { AuthAside } from "@/components/auth/auth-aside";

export const metadata: Metadata = {
    title: "Criar conta | Agendaí ",
    description: "Cadastre seu negócio e comece a receber agendamentos online. ",
};

export default function CadastroPage(){
    return (
        <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
            <main className="flex flex-col px-4 py-6 md:px-10">
                <header>
                    <Link href="/" aria-label="Agendaí, página inicial" className="w-fit">
                        <Logo />
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="flex w-full max-w-sm flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                                Crie sua agenda
                            </h1>
                            <p className="text-pretty text-muted-foreground">
                                Cadastre seu negócio e escolha o link que você vai mandar para os clientes.
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Já tem conta?{" "}
                            <Link 
                                href="/login" 
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            > 
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>

                <footer className="text-xs text-muted-foreground">© 2026 Agendaí</footer>
            </main>

            <AuthAside />
        </div>
    )
}
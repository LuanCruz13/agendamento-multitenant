import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/landing/logo";

export const metadata: Metadata = {
    title: "Entrar | Agendaí",
    description: "Acesse o painel da sua organização no Agendaí.",
};


export default function LoginPage(){
    return(
        <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
            <main className="flex flex-col px-4 py-6 md:px-10">
                <header>
                    <Link href="/" aria-label="Agendaí, página inicial" className="w-fit">
                        <Logo />
                    </Link>
                </header>    

                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="flex w-full max-w-sm flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">Bem-vindo de volta</h1>
                            <p className="text-pretty text-muted-foreground">Entre para ver a agenda e os agendamentos da sua organização.</p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Ainda não tem conta?{" "}
                            <Link
                                href="/cadastro"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                Crie sua agenda grátis
                            </Link>
                        </p>
                    </div>
                </div>


            <footer className="text-xs text-muted-foreground">© 2026 Agendaí</footer>
            </main>
        </div>
    )
}
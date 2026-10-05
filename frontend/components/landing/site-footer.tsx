import Link from "next/link";
import { Logo } from "@/components/landing/logo";

export function SiteFooter(){
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
                <Logo/> 
                <nav aria-label="Rodapé" className="flex gap-6">
                    <Link href="/login" className="hover:text-foreground">
                        Entrar
                    </Link>
                    <Link href="/cadastro" className="hover:text-foreground">
                        Criar conta
                    </Link>
                </nav>
                <p>© {year} Agendaí</p>
            </div>
        </footer>
    )


}
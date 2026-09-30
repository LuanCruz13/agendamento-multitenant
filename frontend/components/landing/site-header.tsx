import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "@/components/landing/logo";

const navLinks = [
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#recursos", label: "Recursos" },
    { href: "#agendar", label: "Sou cliente"},
];

export function SiteHeader(){
    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                <Link href="/" aria-label="Agendaí, página inicial">
                    <Logo />
                </Link>

                <nav aria-label="Principal" className="hidden gap-8 text-sm text-muted-foreground md:flex">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="hover:text-foreground">
                            {link.label}
                        </a>
                    ))}
                </nav>

            </div>
        </header>
    )
}
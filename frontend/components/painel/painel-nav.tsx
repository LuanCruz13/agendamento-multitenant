"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, CalendarClock, ExternalLink, LogOut, Settings } from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { getInitials } from "@/lib/initials";

type PainelNavProps = { 
    organizationName: string;
    organizationSlug: string;
    onLogout: () => void;
};

const NAV_ITEMS = [
    { href: "/painel/agendamentos", label: "Agendamentos", icon: CalendarCheck},
    { href: "/painel/disponibilidade", label: "Disponibilidade", icon: CalendarClock },
    { href: "/painel/configuracoes", label: "Configurações", icon: Settings},
];

export function PainelNav({ organizationName, organizationSlug, onLogout}: PainelNavProps){
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            <Link href="/painel/agendamentos" className="flex w-fit items-center gap-2 px-2 py-1">
                <Logo />
            </Link>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-serif text-sm font-semibold text-primary">
                    {getInitials(organizationName)}
                </span>
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">{organizationName}</span>
                    <span className="truncate text-xs text-muted-foreground">/agendar/{organizationSlug}</span>
                </div>
            </div>

            <nav aria-label="Painel" className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon}) => {
                    const isActive = pathname.startsWith(href);

                    return (
                        <Link 
                            key={href}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={
                                isActive
                                ? "flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary"
                                : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            }
                        >
                            <Icon className="size-4" />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
                <a 
                    href={`/agendar/${organizationSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                
                >
                     <ExternalLink className="size-4" />
                     Ver minha página
                </a>

                <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <LogOut className="size-4" />
                    Sair
                </button>
            </div>
        </div>
    )
}
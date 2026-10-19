"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/landing/logo";
import { PainelNav } from "./painel-nav";

type PainelMobileHeaderProps = {
    organizationName: string;
    organizationSlug: string;
    onLogout: () => void;
};

export function PainelMobileHeader({ organizationName, organizationSlug, onLogout }: PainelMobileHeaderProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur lg:hidden">
            <Link href="/painel/agendamentos" className="flex w-fit items-center gap-2">
                <Logo />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                    render={
                        <Button variant="outline" size="icon" className="size-9 rounded-lg bg-card" aria-label="Abrir menu" />
                    }
                >
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-card p-4">
                    <PainelNav
                        organizationName={organizationName}
                        organizationSlug={organizationSlug}
                        onLogout={onLogout}
                    />
                </SheetContent>
            </Sheet>
        </header>
    );
}

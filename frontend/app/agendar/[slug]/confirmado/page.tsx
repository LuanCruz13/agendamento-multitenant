import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Logo } from "@/components/landing/logo";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";

export const metadata: Metadata = {
    title: "Agendamento confirmado | Agendaí",
};

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ horario?: string; nome?: string; email?: string }>;
};

export default async function ConfirmadoPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { horario, nome, email } = await searchParams;
    const headersList = await headers();
    const host = headersList.get("host") ?? "";

    return (
        <div className="flex min-h-dvh flex-col">
            <header className="border-b border-border">
                <div className="mx-auto flex max-w-5xl items-center px-4 py-4 md:px-6">
                    <Link href="/" aria-label="Agendaí, página inicial" className="w-fit">
                        <Logo />
                    </Link>
                </div>
            </header>

            <BookingConfirmation slug={slug} horario={horario} name={nome} email={email} host={host} />

            <footer className="border-t border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground md:px-6">
                    <span>
                        Agendamentos online com{" "}
                        <Link href="/" className="font-serif text-sm font-semibold text-foreground">
                            Agendaí
                        </Link>
                    </span>
                    <span>© 2026 Agendaí</span>
                </div>
            </footer>
        </div>
    );
}

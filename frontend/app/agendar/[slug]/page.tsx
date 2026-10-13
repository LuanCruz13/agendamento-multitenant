import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/landing/logo";
import { BookingFlow } from "@/components/booking/booking-flow";


export const metadata: Metadata = {
    title: "Agendar horário | Agendaí",
    description: "Escolha um dia e um horário livre e agende sem precisar criar conta."
};

type Props = { params: Promise<{slug: string}>};

export default async function AgendarPage({ params }: Props){
    const { slug } = await params;


    return(
        <div className="flex min-h-dvh flex-col">
            <header className="border-b border-border">
                <div className="mx-auto flex max-w-5xl items-center px-4 py-4 md:px-6">
                    <Link href="/" aria-label="Agendaí, página inicial" className="w-fit">
                        <Logo />
                    </Link>
                </div>
            </header>

            <BookingFlow slug={slug} />
            
            <footer className="border-t border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground md:px-6">
                    <span>
                        Agendamentos online com {" "}
                        <Link href="/" className="font-serif text-sm font-semibold text-foreground">
                            Agendaí
                        </Link>
                    </span>
                    <span>© 2026 Agendaí</span>
                </div>
            </footer>


        </div>
    )
}
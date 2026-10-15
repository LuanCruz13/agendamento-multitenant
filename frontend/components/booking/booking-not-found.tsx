import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingNotFound(){
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16">
            <div className="flex max-w-md flex-col items-center gap-5 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <SearchX className="size-6" />
                </span>
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    Não encontramos essa agenda
                </h1>
                <p className="text-pretty text-muted-foreground">
                    Confira o endereço com o estabelecimento. O link tem o formato{" "}
                    <span className="font-medium text-foreground">agendai.app/agendar/nome-do-negocio</span>.
                </p>
                <Button
                    variant="outline"
                    size="lg"
                    className="h-11 text-base"
                    render={<Link href="/" />}
                    nativeButton={false}
                >
                    Ir para a página inicial
                </Button>
            </div>
        </main>
    );
}
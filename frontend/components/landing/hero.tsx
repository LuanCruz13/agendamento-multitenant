import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { BookingPreview } from "./booking-preview";

export function Hero(){
    
    return(
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 md:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
                <span className="w-fit rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                    Para salões, consultórios e prestadores de serviço
                </span>

                <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
                    Sua agenda aberta, {" "}
                    <span className="text-primary italic">sem troca de mensagens.</span>
                </h1>

                <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
                    Defina seus horários uma vez, compartilhe um link e deixe seus
                    clientes escolherem o melhor horário. Eles não precisam criar
                    conta e recebem a confirmação por e-mail. 
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        size="lg"
                        className="h-11 px-5 text-base"
                        render={<Link href="/cadastro" />}
                        nativeButton={false}
                    >
                        Criar minha organização
                        <ArrowRight />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-11 px-5 text-base"
                        render={<Link href="/login" />}
                        nativeButton={false}
                    >
                        Já tenho conta
                    </Button>
                </div>
            </div>
            <BookingPreview />
        </section>
    )
}
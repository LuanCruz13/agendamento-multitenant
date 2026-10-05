"use client"

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function SlugFinder(){

    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const normalized = slug.trim().toLowerCase();

        if (!SLUG_PATTERN.test(normalized)){
            setError("Use apenas letras minúsculas, números e hífens. Ex.: studio-bela");
            return;
        }

        setError(null);
        router.push("/agendar/" + normalized);
    }


    return(
        <section id="agendar" className="scroll-mt-20 px-4 pb-20 md:px-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:flex-row md:items-center md:justify-between md:px-12 md:py-16">
                <div className="max-w-md">
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance">
                        Recebeu um link de agendamento?
                    </h2>
                    <p className="mt-3 text-primary-foreground/75">Digite o endereço do estabelecimento para ver os horários disponíveis.</p>
                </div>

                <form noValidate onSubmit={handleSubmit} className="w-full max-w-md">
                    <label htmlFor="slug" className="text-sm font-medium text-primary-foreground/85">
                        Endereço do estabelecimento
                    </label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <div className="flex h-11 flex-1 items-center rounded-lg bg-primary-foreground text-foreground focus-within:ring-3 focus-within:ring-accent">
                            <span className="pl-3 text-sm text-muted-foreground select-none">
                                /agendar/
                            </span>
                            <input
                                id="slug"
                                value={slug}
                                onChange={(event) => setSlug(event.target.value)}
                                placeholder="studio-bela"
                                autoComplete="off"
                                spellCheck={false}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? "slug-error" : undefined}
                                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-muted-foreground/60"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-11 bg-accent px-5 text-base text-accent-foreground hover:bg-accent/90"
                        >
                            Ver horários
                            <ArrowRight/>
                        </Button>
                    </div>     
                    {error && (
                        <p id="slug-error" role="alert" className="mt-2 text-sm text-accent">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </section>
    )
}
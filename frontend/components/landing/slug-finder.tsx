"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SLUG_REGEX } from "@/lib/slug";




const slugSchema = z.object({
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(
            z.string().regex(
                SLUG_REGEX,
                "Use apenas letras minúsculas, números e hífens. Ex.: studio-bela"
            )
        ),
});

type SlugFormValues = z.infer<typeof slugSchema>;

export function SlugFinder(){

   const router = useRouter();

   const {
        register,
        handleSubmit,
        formState: { errors },
   } = useForm<SlugFormValues>({
        resolver: zodResolver(slugSchema),
   })

   function onSubmit(values: SlugFormValues){
    router.push("/agendar/" + values.slug);
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

                <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
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
                                placeholder="studio-bela"
                                autoComplete="off"
                                spellCheck={false}
                                aria-invalid={errors.slug ? true : undefined}
                                aria-describedby={errors.slug ? "slug-error" : undefined}
                                className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-muted-foreground/60"
                                {...register("slug")}
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
                    {errors.slug && (
                        <p id="slug-error" role="alert" className="mt-2 text-sm text-accent">
                            {errors.slug.message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    )
}
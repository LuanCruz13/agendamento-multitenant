"use client";

import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


type PublicLinkFieldProps = {
    slug: string;
    className?: string;
}


export function PublicLinkField({ slug, className}: PublicLinkFieldProps){
    const host = typeof window !== "undefined" ? window.location.host : "";

    async function handleCopy(){
        const url = `${window.location.origin}/agendar/${slug}`;
        try{
            await navigator.clipboard.writeText(url);
            toast.success("Link copiado.");
        } catch {
            toast.error("Não foi possível copiar. Selecione o link e copie manualmente.");
        }
    }

    return (
        <div className={cn("flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background p-1.5 pl-3", className)}>
            <Link2 className="size-4 shrink-0 text-muted-foreground"/>
            <span className="min-w-0 flex-1 truncate text-left text-sm">
                {host}/agendar<span className="font-medium">{slug}</span>
            </span>
            <Button size="sm" type="button" onClick={handleCopy} className="h-8 shrink-0 gap-1.5">
                <Copy className="size-4" />
                Copiar
            </Button>
        </div>
    )

}
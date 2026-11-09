"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PublicLinkField } from "@/components/painel/public-link-field";
import { getOrganization } from "@/lib/session";
import { cn } from "@/lib/utils";
import { SettingsCard } from "./settings-card";

export function PublicLinkCard(){


    const organization = getOrganization();
    const slug = organization?.slug ?? "";


    return (
        <SettingsCard 
            id="public-link-heading"
            title="Seu link público"
            description="Compartilhe com os seus clientes para eles agendarem sem precisar criar conta."
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <PublicLinkField slug={slug} className="min-w-0 flex-1" />
                <Link
                    href={`/agendar/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2 bg-background")}
                >
                    <ExternalLink />
                    Abrir página
                </Link>
            </div>
        </SettingsCard>
    )
}
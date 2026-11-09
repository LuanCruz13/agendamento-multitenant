"use client";

import { PublicLinkCard } from "./public-link-card";
import { AccountCard } from "./account-card";
import { OrganizationForm } from "./organization-form";


export function SettingsView(){
    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-1">
                <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Configurações</h1>
                <p className="text-pretty text-muted-foreground">Os dados do seu negócio, o seu link e o acesso à sua conta.</p>
            </div>

            <OrganizationForm />
            <PublicLinkCard />
            <AccountCard />
        </main>
    )
}
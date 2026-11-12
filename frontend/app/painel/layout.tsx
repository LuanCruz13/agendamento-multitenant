"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/session";
import { OrganizationProvider, useOrganization } from "@/components/painel/organization-provider";
import { apiFetch } from "@/lib/api";
import { PainelSidebar } from "@/components/painel/painel-sidebar";
import { PainelMobileHeader } from "@/components/painel/painel-mobile-header";
import { Toaster } from "@/components/ui/sonner";

export default function PainelLayout({ children }: { children: React.ReactNode }){
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!getSession()){
            router.replace("/login");
            return;
        }
        setReady(true);
    }, [ router]);

    if (!ready) return null;

    return (
        <OrganizationProvider>
            <PainelLayoutContent>{children}</PainelLayoutContent>
        </OrganizationProvider>
    );

   
}

function PainelLayoutContent({ children }: { children: React.ReactNode}){

    const router = useRouter();

    const { organization } = useOrganization();
    const organizationName = organization?.name ?? ""
    const organizationSlug = organization?.slug ?? "";

    async function handleLogout(){
        try{
            await apiFetch("/auth/logout", { method: "POST" });
        } finally {
            clearSession();
            router.replace("/login");
        }
    }

    return (
        <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[16rem_1fr]">
            <PainelSidebar
                organizationName={organizationName}
                organizationSlug={organizationSlug}
                onLogout={handleLogout}
            />
            <div className="flex min-w-0 flex-col">
                <PainelMobileHeader
                    organizationName={organizationName}
                    organizationSlug={organizationSlug}
                    onLogout={handleLogout}
                />
                {children}
                <Toaster />
            </div>
        </div>
    )   
}
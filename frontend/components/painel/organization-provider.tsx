"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { getOrganization, setOrganization as persistOrganization } from "@/lib/session";

type Organization = {
    name: string;
    slug: string;
}

type OrganizationContextValue = {
    organization: Organization | null;
    setOrganization: (organization: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }){
    const [organization, setOrganizationState] = useState<Organization | null>(() => getOrganization());

    function setOrganization(next: Organization){
        persistOrganization(next);
        setOrganizationState(next);
    }

    return (
        <OrganizationContext.Provider value={{ organization, setOrganization }}>
            {children}
        </OrganizationContext.Provider>
    )
}

export function useOrganization(){
    const context = useContext(OrganizationContext);
    if (!context){
        throw new Error("UseOrganization precisa ser usado dentro de um OrganizationProvider");
    }
    return context;
}
import { PainelNav } from "./painel-nav";

type PainelSidebarProps = {
    organizationName: string;
    organizationSlug: string;
    onLogout: () => void;
};

export function PainelSidebar({ organizationName, organizationSlug, onLogout}: PainelSidebarProps){
    return(
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-card p-4 lg:flex">
            <PainelNav
                organizationName={organizationName}
                organizationSlug={organizationSlug}
                onLogout={onLogout}
            />
        </aside>
    )
}
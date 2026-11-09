import type { ReactNode } from "react";


type SettingsCardProps = {
    id: string;
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
}


export function SettingsCard({ id, title, description, children, footer}: SettingsCardProps){
    return (
        <section className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby={id}>
            <div className="flex flex-col gap-1 px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 id={id} className="font-serif text-lg font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-pretty text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">{children}</div>
            {footer && (
                <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                    {footer}
                </div>
            )}
        </section>
    );
}
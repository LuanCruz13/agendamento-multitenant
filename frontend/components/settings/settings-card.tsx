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
        <section>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <div>{children}</div>
        </section>
    )
}
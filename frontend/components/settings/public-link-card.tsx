import { SettingsCard } from "./settings-card";

export function PublicLinkCard(){
    return (
        <SettingsCard 
            id="public-link-heading"
            title="Seu link público"
            description="Compartilhe com os seus clientes para eles agendarem sem precisar criar conta."
        >
            <p>link aqui</p>
        </SettingsCard>
    )
}
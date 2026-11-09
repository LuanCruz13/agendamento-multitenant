import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsCard } from "./settings-card";


export function AccountCard(){
    return (
        <SettingsCard
            id="account-heading"
            title="Conta"
            description="Seus dados de acesso ao painel."
        >
            <dl className="flex flex-col divide-y divide-border">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <dt className="text-sm font-medium">E-mail de acesso</dt>
                    <dd className="text-sm text-muted-foreground">camila@studiobela.com</dd>
                </div>
                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <dt className="text-sm font-medium">Senha</dt>
                        <dd className="text-sm text-muted-foreground">
                            Vamos enviar um link para o seu e-mail para você criar uma nova senha.
                        </dd>
                    </div>
                    <Button variant="outline" className="h-10 w-fit gap-2 bg-background">
                        <KeyRound />
                        Alterar senha
                    </Button>
                </div>
            </dl>
        </SettingsCard>
    );
}
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { useResendCooldown } from "@/lib/use-resend-cooldown";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsCard } from "./settings-card";
import { getUser } from "@/lib/session";


export function AccountCard(){

    const email = getUser()?.email ?? "";

    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);
    const { cooldown, start: startCooldown} = useResendCooldown(45);

    async function handleSendReset(){
        if (cooldown > 0 || pending) return;
        setPending(true);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if(!response.ok){
                toast.error("Algo deu errado. Tente novamente.");
                return;
            }

            setSent(true);
            startCooldown();
        } catch {
            toast.error("Não foi possível conectar ao servidor.");
        } finally {
            setPending(false);
        }
    }

    return (
        <SettingsCard
            id="account-heading"
            title="Conta"
            description="Seus dados de acesso ao painel."
        >
            <dl className="flex flex-col divide-y divide-border">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <dt className="text-sm font-medium">E-mail de acesso</dt>
                    <dd className="text-sm text-muted-foreground">{email}</dd>
                </div>
                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <dt className="text-sm font-medium">Senha</dt>
                        <dd className="text-sm text-muted-foreground">
                            {sent ? (
                                <span className="flex items-center gap-1.5">
                                    <MailCheck className="size-4 text-primary" />
                                    Link enviado para <span className="font-medium">{email}</span>. Ele vale por 1 hora.
                                </span>
                            ) : (
                                "Vamos enviar um link para o seu e-mail para você criar uma nova senha."
                            )}
                        </dd>
                    </div>
                    <Button 
                        variant="outline" 
                        className="h-10 w-fit gap-2 bg-background"
                        disabled={pending || cooldown > 0}
                        onClick={handleSendReset}
                    >
                        {cooldown > 0 ? (
                            <>Reenviar em 0:{String(cooldown).padStart(2, "0")}</>
                        ) : (
                            <>
                                <KeyRound />
                                {sent ? "Reenviar link" : "Alterar senha"}
                            </>
                        )}
                    </Button>
                </div>
            </dl>
        </SettingsCard>
    );
}
"use client"

import { useState } from "react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { SettingsCard } from "./settings-card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/lib/validations/organization";
import { getOrganization, setOrganization } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert, AlertCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";





const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";


export function OrganizationForm(){

    const organization = getOrganization()

    const host = typeof window !== "undefined" ? window.location.host : "";
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(organizationSchema),
        mode: "onChange",
        defaultValues: {
            name: organization?.name ?? "",
            slug: organization?.slug ?? "",
        },
    });

    async function submitChanges(payload: { name?: string; slug?: string }){
        setPending(true);
        setServerError(null);

        try {
            const response = await apiFetch("/organizations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setOrganization({ name: data.name, slug: data.slug});
                form.reset({ name: data.name, slug: data.slug});
                setConfirmOpen(false);
                toast.success("Configurações salvas.");
                return;
            }

            if (response.status === 409) {
                setConfirmOpen(false);
                form.setError("slug", { message: "Esse endereço já está em uso. Escolha outro." });
                form.setFocus("slug");
                return;
            }

            setServerError("Confira os dados e tente novamente.");
        } catch {
            setServerError("Não foi possível salvar. Tente novamente.")
        } finally {
            setPending(false);
        }
    }

    //montando o payload p/ decidir o fluxo
    function onSubmit(values: { name: string; slug: string }) {
        const payload: { name?: string; slug?: string } = {};
        if (form.formState.dirtyFields.name) payload.name = values.name;
        if (form.formState.dirtyFields.slug) payload.slug = values.slug;
    
        if (form.formState.dirtyFields.slug) {
            setConfirmOpen(true);
            return;
        }
    
        submitChanges(payload);
    }



    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <SettingsCard
            id="organization-heading"
            title="Dados do negócio"
            description="Aparecem para os seus clientes na página de agendamento."
            footer={
                <>
                    <span className="hidden text-xs sm:mr-auto sm:block">
                        {form.formState.isDirty ? (
                            <span className="font-medium text-accent-foreground">Alterações não salvas</span>
                        ) : 
                        (
                            <span className="text-muted-foreground">Nenhuma alteração</span>
                        )}
                    </span>
                    <Button 
                        type="button"
                        variant="outline"
                        className="h-10 bg-background"
                        disabled={!form.formState.isDirty}
                        onClick={() => form.reset()}
                    >
                        Descartar
                    </Button>
                    <Button 
                        type="submit"
                        className="h-10"
                        disabled={!form.formState.isDirty || Object.keys(form.formState.errors).length > 0}
                    >   
                        {form.formState.isSubmitting ? (
                            <>
                                <Spinner />
                                Salvando...
                            </>
                        ) : (
                            "Salvar alterações"
                        )}
                    </Button>
                </>
            }
            >
                {serverError && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}
            <Controller 
                name="name"
                control={form.control}
                render={({ field, fieldState} ) => (
                    <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="org-name" className="text-foreground">Nome do negócio</FieldLabel>
                        <Input 
                            {...field}
                            id="org-name" 
                            autoComplete="organization" 
                            className={cn(controlClass, "rounded-lg")} 
                        />
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />

            <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="org-slug" className="text-foreground">Endereço do seu link</FieldLabel>
                        <InputGroup className={cn(controlClass, "rounded-lg")}>
                            <InputGroupAddon>
                                <InputGroupText className="shrink-0 text-sm">agendai.app/agendar/</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                {...field}
                                id="org-slug"
                                autoComplete="off"
                                spellCheck={false}
                                autoCapitalize="none"
                                className="pl-0"
                            />
                        </InputGroup>
                        <FieldError errors={[fieldState.error]} />
                        <FieldDescription className="text-xs">Use letras minúsculas, números e hífens.</FieldDescription>
                    </Field>
                )}
            />

                {form.watch("slug") !== organization?.slug && (
                    <div role="status" className="flex items-start gap-3 rounded-xl border border-accent/50 bg-accent/15 p-4">
                        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold">O link antigo vai parar de funcionar</span>
                            <span className="text-sm text-pretty text-muted-foreground">
                                Quem abrir <span className="font-medium text-foreground">{host}/agendar/{organization?.slug}</span> vai ver "Não encontramos essa agenda". Atualize o link onde você divulgou: Instagram, WhatsApp e materiais impressos.
                            </span>
                        </div>
                    </div>
                )}


            </SettingsCard>

            <AlertDialog 
                open={confirmOpen} 
                onOpenChange={(open) => !open && !pending && setConfirmOpen(false)}
            >
                <AlertDialogContent className="max-w-md gap-5 rounded-2xl p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-serif text-xl font-semibold tracking-tight">
                            Trocar o endereço do seu link?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            O endereço antigo para de funcionar assim que você salvar. Não dá para redirecionar quem usar o link antigo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-12 shrink-0 text-xs text-muted-foreground">Antes</span>
                            <span className="truncate text-muted-foreground line-through">
                                {host}/agendar/{organization?.slug}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-12 shrink-0 text-xs text-muted-foreground">Depois</span>
                            <span className="truncate font-medium">
                                {host}/agendar/{form.watch("slug")}
                            </span>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Manter endereço atual</AlertDialogCancel>
                        <AlertDialogAction 
                            disabled={pending}
                            onClick={() => {
                                const values = form.getValues();
                                const payload: { name?: string; slug?: string } = {};
                                if (form.formState.dirtyFields.name) payload.name = values.name;
                                payload.slug = values.slug;
                                submitChanges(payload);
                            }}
                        >   
                            { pending ? (
                                <>
                                    <Spinner />
                                    Salvando...
                                </>
                            ) : (
                                "Trocar endereço"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
            
    )
}
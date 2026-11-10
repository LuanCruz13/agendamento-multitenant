"use client"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { SettingsCard } from "./settings-card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/lib/validations/organization";
import { getOrganization } from "@/lib/session";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";


export function OrganizationForm(){

    const organization = getOrganization()

    const form = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: organization?.name ?? "",
            slug: organization?.slug ?? "",
        },
    });

    return (
        <form onSubmit={form.handleSubmit(() => {})}>
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
            </SettingsCard>
        </form>
            
    )
}
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { SettingsCard } from "./settings-card";

const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm";


export function OrganizationForm(){
    return (
        <SettingsCard
            id="organization-heading"
            title="Dados do negócio"
            description="Aparecem para os seus clientes na página de agendamento."
        >
            <Field>
                <FieldLabel htmlFor="org-name" className="text-foreground">Nome do negócio</FieldLabel>
                <Input id="org-name" autoComplete="organization" defaultValue="Studio Bela" className={cn(controlClass, "rounded-lg")} />
            </Field>

            <Field>
                <FieldLabel htmlFor="org-slug" className="text-foreground">Endereço do seu link</FieldLabel>
                <InputGroup className={cn(controlClass, "rounded-lg")}>
                    <InputGroupAddon>
                        <InputGroupText className="shrink-0 text-sm">agendai.app/agendar/</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput 
                        id="org-slug"
                        defaultValue="studio-bela"
                        autoComplete="off"
                        spellCheck={false}
                        autoCapitalize="none"
                        className="pl-0"
                    />
                </InputGroup>
                <FieldDescription className="text-xs">Use letras minúsculas, números e hífens.</FieldDescription>
            </Field>
        </SettingsCard>
    )
}
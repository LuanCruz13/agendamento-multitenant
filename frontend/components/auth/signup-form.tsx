"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm"

export function SignupForm(){
    const [showPassword, setShowPassword] = useState(false);


    return (
        <form noValidate className="flex flex-col gap-5">
            <FieldGroup className="gap-5">
                <Field> 
                    <FieldLabel htmlFor="name">Nome do negócio</FieldLabel>
                    <Input 
                        id="name"
                        autoComplete="organization"
                        placeholder="Ex.: Studio Bela"
                        className={cn(controlClass, "rounded-lg")}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="ownerName">Seu nome</FieldLabel>
                    <Input
                        id="ownerName"
                        autoComplete="name"
                        placeholder="Ex.: Maria Silva"
                        className={cn(controlClass, "rounded-lg")}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="slug">Endereço do seu link</FieldLabel>
                        <InputGroup className={cn(controlClass, "rounded-lg")}>
                            <InputGroupAddon>
                                <InputGroupText className="shrink-0 text-sm">
                                    agendai.app/agendar/
                                </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                id="slug"
                                placeholder="studio-bela"
                                autoComplete="off"
                                spellCheck={false}
                                autoCapitalize="none"
                                className="pl-0"
                            />
                        </InputGroup>
                        <FieldDescription className="text-xs">
                            Use letras minúsculas, números e hífens.
                        </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Seu e-mail</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="voce@seunegocio.com"
                        className={cn(controlClass, "rounded-lg")}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                        <InputGroup className={cn(controlClass, "rounded-lg")}>
                            <InputGroupInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Mínimo de 8 caracteres"    
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    size="icon-xs"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                </Field>
            </FieldGroup>

            <Button type="submit" size="lg" className="mt-1 h-11 text-base">
                Criar minha organização
            </Button>
        </form>
    )
}
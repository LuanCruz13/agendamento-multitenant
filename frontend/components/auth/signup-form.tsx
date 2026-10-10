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
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { SLUG_REGEX } from "@/lib/slug";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm"

const signupSchema = z.object({
    name: z.string().trim().min(1, "Informe o nome do seu negócio."),
    ownerName: z.string().trim().min(1, "Informe seu nome."),
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(
            z.string().regex(
                SLUG_REGEX,
                "Use apenas letras minúsculas, números e hifens."
            )
        ),
        email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
        password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm(){
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            ownerName: "",
            slug: "",
            email: "",
            password: "",
        }
    });


    return (
        <form noValidate onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-5">
            <FieldGroup className="gap-5">
                <Controller
                    name="name"
                    control={control}
                    render={ ({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}> 
                        <FieldLabel htmlFor="name" className="text-foreground">Nome do negócio</FieldLabel>
                        <Input 
                            {...field}
                            id="name"
                            autoComplete="organization"
                            placeholder="Ex.: Studio Bela"
                            className={cn(controlClass, "rounded-lg")}
                        />
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                    )}
                />

                <Controller 
                    name="ownerName"
                    control={control}
                    render={ ({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="ownerName" className="text-foreground">Seu nome</FieldLabel>
                        <Input
                            {...field}
                            id="ownerName"
                            autoComplete="name"
                            placeholder="Ex.: Maria Silva"
                            className={cn(controlClass, "rounded-lg")}
                        />
                         <FieldError errors={[fieldState.error]} />
                    </Field>
                    )}
                />
               
                <Controller
                    name="slug"
                    control={control}
                    render={ ({field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="slug" className="text-foreground">Endereço do seu link</FieldLabel>
                            <InputGroup className={cn(controlClass, "rounded-lg")}>
                                <InputGroupAddon>
                                    <InputGroupText className="shrink-0 text-sm">
                                        agendai.app/agendar/
                                    </InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    {...field}
                                    id="slug"
                                    placeholder="studio-bela"
                                    autoComplete="off"
                                    spellCheck={false}
                                    autoCapitalize="none"
                                    className="pl-0"
                                />
                            </InputGroup>
                            <FieldError errors={[fieldState.error]} />
                            <FieldDescription className="text-xs">
                                Use letras minúsculas, números e hífens.
                            </FieldDescription>
                    </Field>
                    )}    
                />
                    
                <Controller
                    name="email"
                    control={control}
                    render={ ({field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="email" className="text-foreground">Seu e-mail</FieldLabel>
                        <Input
                            {...field}
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="voce@seunegocio.com"
                            className={cn(controlClass, "rounded-lg")}
                        />
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={ ({field, fieldState}) => (
                        <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="password" className="text-foreground">Senha</FieldLabel>
                            <InputGroup className={cn(controlClass, "rounded-lg")}>
                                <InputGroupInput
                                    {...field}
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
                            <FieldError errors={[fieldState.error]} />
                    </Field>
                    )}
                   
                />
            </FieldGroup>

            <Button type="submit" size="lg" className="mt-1 h-11 text-base">
                Criar minha organização
            </Button>
        </form>
    )
}
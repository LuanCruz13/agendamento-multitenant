"use client";

import { useState, useEffect } from "react";
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
import { slugify } from "@/lib/slug";
import { nameSchema, slugSchema } from "@/lib/validations/organization";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { setSession, setOrganization } from "@/lib/session";

const API_URL= process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"


const controlClass = "h-11 bg-card text-base shadow-xs md:text-sm"

const signupSchema = z.object({
    name: nameSchema,
    ownerName: z.string().trim().min(1, "Informe seu nome."),
    slug: slugSchema,
    email: z.string().trim().min(1, "Informe seu e-mail.").pipe(z.email("E-mail inválido.")),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm(){
    const router = useRouter();
    
    const [showPassword, setShowPassword] = useState(false);
    const [slugEdited, setSlugEdited] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);


    const { control, handleSubmit, setValue } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            ownerName: "",
            slug: "",
            email: "",
            password: "",
        }
    });

    const name = useWatch({ control, name: "name"});

    useEffect(() => {
        if (!slugEdited){
            setValue("slug", slugify(name));
        }
    }, [name, slugEdited, setValue]);

    async function onSubmit (values: SignupFormValues) {
        setFormError(null);
        setPending(true);

        try {
            const response = await fetch(`${API_URL}/organizations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    slug: values.slug,
                    ownerName: values.ownerName,
                    ownerEmail: values.email,
                    ownerPassword: values.password,
                }),
            });

            if (!response.ok){
                if (response.status === 409){
                    setFormError("Esse nome de negócio ou email já está em uso. ");
                } else {
                    setFormError("Algo deu errado. Tente novamnete.");
                }
                return;
            }

            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: values.email, password: values.password}),
            });

            if (!loginResponse.ok){
                setFormError("Conta criada! Faça login para continuar.");
                return;
            }

            const data = await loginResponse.json();
            setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken});
            setOrganization(data.organization);

            router.push("/painel/disponibilidade");
        } catch {
            setFormError("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
        } finally {
            setPending(false);
        }
    }


    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {formError && (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>{formError}</AlertDescription>
                </Alert>
            )}


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
                                    onChange={(e) => {
                                        setSlugEdited(true);
                                        field.onChange(e);
                                    }}
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

            <Button type="submit" size="lg" className="mt-1 h-11 text-base" disabled={pending}>
                {pending ? (
                    <>
                        <Spinner/>
                        Criando...
                    </>
                ): (
                    "Criar minha organização"
                )}
            </Button>
        </form>
    )
}
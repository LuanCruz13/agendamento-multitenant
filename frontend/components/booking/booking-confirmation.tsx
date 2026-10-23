import Link from "next/link";
import { CalendarDays, Clock, User, Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/initials";
import { slugToName } from "@/lib/slug";
import { formatFullDate, formatSlotRange } from "@/lib/dates";

type BookingConfirmationProps = {
    slug: string;
    horario?: string;
    name?: string;
    email?: string;
    host: string;
  };


  export function BookingConfirmation({ slug, horario, name, email, host}: BookingConfirmationProps){

    const orgName = slugToName(slug);
    const hasData = Boolean(name && email)
    const firstName = name?.split(" ")[0];
    const dateLabel = horario ? formatFullDate(horario) : "";
    const timeLabel = horario ? `${formatSlotRange(horario)} · 60 min` : "";


    return (
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-8 px-4 py-12 text-center md:py-16">
            <div className="relative flex items-center justify-center">
                <div className="absolute size-36 rounded-full bg-amber-200/40 blur-2xl" aria-hidden />
                <div className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-8" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
                    Agendamento confirmado!
                </h1>
                <p className="text-pretty text-muted-foreground">
                    {hasData
                    ? `Tudo certo, ${firstName}. Seu horário no ${orgName} está reservado.`
                    : `Seu horário no ${orgName} está reservado.`
                    }
                </p>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm">
                <div className="flex items-center gap-3 p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-serif text-sm font-semibold text-primary-foreground">
                        {getInitials(orgName)}
                    </span>
                    <div className="flex flex-col">
                        <span className="font-serif text-base font-semibold">{orgName}</span>
                        <span className="text-xs text-muted-foreground">{host}/agendar/{slug}</span>
                    </div>
                </div>
                <div className="divide-y divide-border border-t border-border">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                            Data
                    </span>
                    <span className="text-sm font-medium">{dateLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                            Horário
                    </span>
                    <span className="text-sm font-medium">{timeLabel}</span>
                </div>
                    {hasData && (
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="size-4" />
                                Nome
                            </span>
                            <span className="text-sm font-medium">{name}</span>
                        </div>
                    )}
            </div>
            </div>
            
           

            <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4 text-left text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 translate-y-0.5 text-primary" />
                <p>
                {hasData ? (
                    <>
                    Enviamos a confirmação para <span className="font-medium text-foreground">{email}</span>. Se não encontrar, confira a caixa de spam.
                    </>
                ) : (
                    "Enviamos a confirmação para o e-mail informado no agendamento. Se não encontrar, confira a caixa de spam."
                )}
                </p>
            </div>

            <Button render={<Link href={`/agendar/${slug}`} />} variant="outline" nativeButton={false} className="h-10 gap-2">
                Fazer outro agendamento
                <ArrowRight className="size-4" />
            </Button>

            <p className="text-xs text-muted-foreground">
                Precisa remarcar ou cancelar? Fale diretamente com o {orgName}.
            </p>
        </main>
    )
  }
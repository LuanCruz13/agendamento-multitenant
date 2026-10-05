import { Ban, CalendarClock, ListChecks, MailCheck, ShieldCheck, UserRoundX } from "lucide-react";

const features = [
    {
        icon: CalendarClock,
        title: "Horários recorrentes",
        description: "Configure sua disponibilidade por dia da semana e ela vale para todas as semanas."
    },
    {
        icon: Ban,
        title: "Sem conflito de horário",
        description: "Um horário já reservado some da lista na hora. Nada de dois clientes no mesmo horário."
    },
    {
        icon: UserRoundX,
        title: "Cliente sem cadastro",
        description:
          "Quem agenda informa só nome e e-mail. Menos atrito, mais agendamentos.",
      },
      {
        icon: MailCheck,
        title: "Confirmação por e-mail",
        description:
          "Cada agendamento dispara um e-mail de confirmação automaticamente.",
      },
      {
        icon: ListChecks,
        title: "Painel de agendamentos",
        description:
          "Veja todos os seus horários marcados e cancele quando precisar, liberando a vaga.",
      },
      {
        icon: ShieldCheck,
        title: "Dados isolados",
        description:
          "Cada organização enxerga apenas os próprios dados. Sempre, em todas as operações.",
      },
]


export function Features(){
    return (
        <section id="recursos" className="scroll-mt-20">
            <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
                <div className="max-w-2xl">
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">O essencial para organizar seus atendimentos</h2>
                </div>
            

            <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <li
                            key={feature.title}
                            className="flex flex-col gap-3 bg-background p-6 md:p-8"
                        >
                            <div className=" flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="size-5"/>
                            </div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                        </li>
                    );
                })}
            </ul>
            </div>
        </section>
    )
}
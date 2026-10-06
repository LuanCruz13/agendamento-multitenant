import { CalendarDays, Clock } from "lucide-react";

const appointments = [
    { time: "9:00", name: "Marina Costa", service: "Corte e escova"},
    { time: "10:30", name: "Rafael Lima", service: "Barba" },
    { time: "14:00", name: "Juliana Alves", service: "Coloração"},
];

export function AuthAside(){
    return (
        <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
            <div aria-hidden="true" className="absolute -top-32 -right-32 size-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

            <span className="relative w-fit rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-medium text-primary-foreground/80">
                Painel da organização
            </span>

            <div className="relative flex flex-col gap-10">
                <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-2xl shadow-black/20">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-primary" />
                            <span className="text-sm font-semibold">Hoje</span>
                        </div>
                        <span className="rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-medium">
                            3 agendamentos
                        </span>
                    </div>

                    <ul className="flex flex-col divide-y divide-border">
                        {appointments.map((appointment) => (
                            <li 
                                key={appointment.time} className="flex items-center gap-4 py-3"
                            >
                                <span className="flex w-16 items-center gap-1.5 text-sm font-medium text-primary">
                                    <Clock className="size-3.5" />
                                    {appointment.time}
                                </span>
                                <div>
                                    <p className="text-sm font-medium">{appointment.name}</p>
                                    <p className="text-xs text-muted-foreground">{appointment.service}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <blockquote className="flex flex-col gap-4">
                    <p className="font-serif text-3xl font-medium leading-tight text-balance">
                        &quot;Parei de responder mensagem pra marcar horário. Agora o cliente
                    escolhe e eu só confiro a agenda.&quot;
                    </p>
                    <footer className="text-sm text-primary-foreground/70">
                        Camila Rocha, Studio Camila Hair
                    </footer>
                </blockquote>
            </div>
        </aside>
    )
}
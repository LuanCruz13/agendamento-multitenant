import { Check, Link2 } from "lucide-react";

const days = [
    { label: "Seg", number: 12, active: false },
    { label: "Ter", number: 13, active: true },
    { label: "Qua", number: 14, active: false},
    { label: "Qui", number: 15, active: false},
    { label: "Sex", number: 16, active: false},

];

const slots = [
    { time: "09:00", status: "free" },
    { time: "10:00", status: "busy" },
    { time: "11:00", status: "selected" },
    { time: "14:00", status: "free" },
    { time: "15:00", status: "busy" },
    { time: "16:00", status: "free" },
  ];


export function BookingPreview(){
    return (
        <div className="relative" aria-hidden="true">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/25 blur-2xl" />

                <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-primary/5 md:p-6">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                        <Link2 className="size-3.5" />
                        <span>
                            agendai.app/agendar/
                            <span className="font-medium text-foreground">studio-bela</span>
                        </span>
                    </div>

                    <div className="mt-5 flex justify-between">
                        <div>
                            <p className="font-serif text-lg font-semibold">Studio Bela</p>
                            <p className="text-sm text-muted-foreground">Escolha um horário · 60 min</p>
                        </div>
                        <span className="h-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                            Out 2026
                        </span>
                    </div>


                    <div className="mt-5 grid grid-cols-5 gap-2">
                        {days.map((day) => (
                            <div
                                key={day.label}
                                className={`flex flex-col items-center rounded-lg border py-2 text-xs ${
                                    day.active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-muted-foreground"
                                }`}
                            >
                                <span>{day.label}</span>
                                <span className={`text-base font-semibold ${day.active ? "": "text-foreground"}`}>
                                    {day.number}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                            <div
                                key={slot.time} 
                                className={`flex items-center justify-center gap-1 rounded-lg border py-2.5 text-sm font-medium ${
                                    slot.status === "selected"
                                      ? "border-accent bg-accent text-accent-foreground"
                                      : slot.status === "busy"
                                        ? "border-dashed text-muted-foreground/60 line-through"
                                        : "border-border bg-background"
                                  }`}
                            >
                                {slot.status === "selected" && <Check className="size-3.5" /> }
                                {slot.time}
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Check className="size-4 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">Agendamento confirmado</p>
                            <p className="text-muted-foreground">Enviamos os detalhes para o seu e-mail.</p>
                        </div>
                    </div>
                </div>

        </div>
        
    )
}
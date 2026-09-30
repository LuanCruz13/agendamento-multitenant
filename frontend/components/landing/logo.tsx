import { CalendarCheck } from "lucide-react";

export function Logo(){
  return(
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CalendarCheck className="size-4"/>
      </div>
      <span className="font-serif text-xl font-semibold tracking-tight">
        Agendaí
      </span>
    </div>
  )
}
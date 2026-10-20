type BookingDayGroupProps = {
    title: string;
    subtitle: string;
    count: number;
    children: React.ReactNode;
};

export function BookingDayGroup({ title, subtitle, count, children }: BookingDayGroupProps) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
                <h2 className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-semibold tracking-tight">{title}</span>
                    <span className="text-sm text-muted-foreground">{subtitle}</span>
                </h2>
                <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "agendamento" : "agendamentos"}    
                </span>                
            </div>
            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {children}
            </ul>
        </section>
    );
}

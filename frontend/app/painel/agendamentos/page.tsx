"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDayGroup } from "@/components/bookings/booking-day-group";
import { BookingRow } from "@/components/bookings/booking-row";

const MOCK_UPCOMING = [
    {
        title: "Hoje",
        subtitle: "sexta, 16 de outubro",
        bookings: [
            { id: "1", clientName: "Marina Costa", clientEmail: "marina.costa@email.com", clientPhone: "(65) 99812-3344", scheduledAt: "2026-10-16T09:00:00.000Z", status: "CONFIRMED" as const },
            { id: "2", clientName: "Rafael Lima", clientEmail: "rafael.lima@email.com", clientPhone: "(65) 98254-3321", scheduledAt: "2026-10-16T10:00:00.000Z", status: "CONFIRMED" as const },
            { id: "3", clientName: "Juliana Alves", clientEmail: "juliana.alves@email.com", clientPhone: "(65) 99654-1209", scheduledAt: "2026-10-16T14:00:00.000Z", status: "CONFIRMED" as const },
        ],
    },
    {
        title: "Amanhã",
        subtitle: "sábado, 17 de outubro",
        bookings: [
            { id: "4", clientName: "Carla Mendes", clientEmail: "carla.mendes@email.com", clientPhone: "(65) 99231-7788", scheduledAt: "2026-10-17T09:00:00.000Z", status: "CONFIRMED" as const },
            { id: "5", clientName: "Pedro Santos", clientEmail: "pedro.santos@email.com", clientPhone: "(65) 99237-2827", scheduledAt: "2026-10-17T11:00:00.000Z", status: "CONFIRMED" as const },
        ],
    },
    {
        title: "Segunda",
        subtitle: "19 de outubro",
        bookings: [
            { id: "6", clientName: "Ana Souza", clientEmail: "ana.souza@email.com", clientPhone: "(65) 99812-3344", scheduledAt: "2026-10-19T15:00:00.000Z", status: "CONFIRMED" as const },
            { id: "7", clientName: "Bruno Ferreira", clientEmail: "bruno.ferreira@email.com", clientPhone: null, scheduledAt: "2026-10-19T16:00:00.000Z", status: "CONFIRMED" as const },
        ],
    },
];

export default function AgendamentosPage() {
    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">Agendamentos</h1>
                    <p className="text-pretty text-muted-foreground">
                        Os horários que seus clientes marcaram pelo seu link.
                    </p>
                </div>
                <Button variant="outline" className="h-9 w-fit gap-2 rounded-lg bg-card shadow-xs">
                    <Copy />
                    Copiar link da agenda
                </Button>
            </div>

            <Tabs defaultValue="proximos">
                <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted p-1 sm:inline-flex sm:w-fit">
                <TabsTrigger value="proximos" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Próximos
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">7</span>
                    </TabsTrigger>
                    <TabsTrigger value="anteriores" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Anteriores
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">12</span>
                    </TabsTrigger>
                    <TabsTrigger value="cancelados" className="group h-8 gap-1.5 rounded-md px-2 text-sm font-medium sm:gap-2 sm:px-3">
                        Cancelados
                        <span className="rounded-full bg-background px-1.5 text-xs font-semibold group-data-active:bg-primary/10 group-data-active:text-primary">2</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="proximos" className="flex flex-col gap-8 pt-6">
                    {MOCK_UPCOMING.map((group) => (
                        <BookingDayGroup
                            key={group.title}
                            title={group.title}
                            subtitle={group.subtitle}
                            count={group.bookings.length}
                        >
                            {group.bookings.map((booking) => (
                                <BookingRow 
                                key={booking.id}
                                id={booking.id}
                                clientName={booking.clientName}
                                clientEmail={booking.clientEmail}
                                clientPhone={booking.clientPhone}
                                scheduledAt={booking.scheduledAt}
                                status={booking.status}
                                canCancel
                                onCancel={() => {}}
                                />
                            ))}
                        </BookingDayGroup>
                    ))}
                </TabsContent>

                <TabsContent value="anteriores" className="pt-6">
                    <p className="text-sm text-muted-foreground">(mock — ainda sem dados nessa aba)</p>
                </TabsContent>

                <TabsContent value="cancelados" className="pt-6">
                    <p className="text-sm text-muted-foreground">(mock — ainda sem dados nessa aba)</p>
                </TabsContent>

            </Tabs>


        </main>
    );
}

import type { Metadata } from "next";
import { AvailabilityView } from "@/components/availability/availability-view";

export const metadata: Metadata = {
    title: "Disponibilidade | Agendaí",
};

export default function DisponibilidadePage() {
    return <AvailabilityView />;
}
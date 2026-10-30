import { z } from "zod";
import { overlaps, toMinutes, WEEKDAY_LABEL, type Range } from "@/lib/availability";

export function makeAvailabilitySchema(existing: Range[], editingId?: string){
    return z.object({
        weekday: z.number().int().min(0).max(6),
        start: z.string(),
        end: z.string(),
    })
        .refine((v) => toMinutes(v.end) > toMinutes(v.start), {
            message: "O fim precisa ser depois do início.",
            path: ["end"],
        })
        .superRefine((v, ctx) => {
            const clash = existing.find(
                (r) => r.weekday === v.weekday && r.id !== editingId && overlaps(r, { ...v, id: "" })
            );
            if (clash){
                ctx.addIssue({
                    code: "custom",
                    path: ["start"],
                    message: `Essa faixa se sobrepõe a ${clash.start} - ${clash.end} na ${WEEKDAY_LABEL[v.weekday].toLowerCase()}.`,
                });
            }
        });
}
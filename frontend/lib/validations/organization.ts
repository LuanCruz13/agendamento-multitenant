import { z } from "zod";
import { SLUG_REGEX } from "@/lib/slug"

export const nameSchema = z 
    .string()
    .trim()
    .min(1, "Informe o nome do negócio.")
    .max(80, "Use no máximo 80 caracteres.");


export const slugSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Use pelo menos 3 caracteres.")
    .regex(SLUG_REGEX, "Use apenas letras minúsculas, números e hífens. Ex.: studio-bela")


export const organizationSchema = z.object({
    name: nameSchema,
    slug: slugSchema,
});
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const
export const WEEKDAY_LABEL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export const toHHMM = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))

export const slotsIn = (start: string, end: string) => Math.floor((toMinutes(end) - toMinutes(start)) / 60)

export type Range = { start: string; end: string }

export const overlaps = (a: Range, b: Range) => (
    toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end)
)
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const SLOT_DURATION_MINUTES = 60;


@Injectable()
export class PublicService {
    constructor(private readonly prisma: PrismaService){}

    async getSlots(slug: string, dateParam: string){
        const date = new Date(dateParam);

        if (isNaN(date.getTime())){
            throw new BadRequestException('data inválida')
        }

        const organization = await this.prisma.organization.findUnique({ where: { slug }});

            if (!organization) {
                throw new NotFoundException('organização não encontrada');
            }
        
        const weekday = date.getUTCDay();
        
        const availabilities = await this.prisma.availability.findMany({
            where: { organizationId: organization.id, weekday}
        })
        
        const dayStart = new Date(date);
        dayStart.setUTCHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setUTCHours(23, 59, 59, 999);

        const bookings = await this.prisma.booking.findMany({
            where: {
                organizationId: organization.id,
                status: 'CONFIRMED',
                scheduledAt: {
                    gte: dayStart, lte: dayEnd
                },
            }
        });

        const occupied = new Set(bookings.map((booking) => booking.scheduledAt.getTime()));

        const slots: Date[] = [];

        for (const availability of availabilities){
            const slotStart = new Date(date);
            slotStart.setUTCHours(availability.startTime.getUTCHours(), availability.startTime.getUTCMinutes(), 0 , 0)

            const windowEnd = new Date(date);
            windowEnd.setUTCHours(availability.endTime.getUTCHours(), availability.endTime.getUTCMinutes(), 0, 0);

            while (slotStart < windowEnd){
                if (!occupied.has(slotStart.getTime())){
                    slots.push(new Date(slotStart));
                }
                slotStart.setUTCMinutes(slotStart.getUTCMinutes() + SLOT_DURATION_MINUTES);
            }
        }

        return slots;

    }

        




}

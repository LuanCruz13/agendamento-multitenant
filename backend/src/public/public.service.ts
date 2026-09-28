import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma } from '@prisma/client';

import { EmailService } from 'src/email/email.service';

const SLOT_DURATION_MINUTES = 60;



@Injectable()
export class PublicService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ){}

    async createBooking(slug: string, dto: CreateBookingDto){
        const scheduledAt = new Date(dto.scheduledAt);

        if (isNaN(scheduledAt.getTime())){
            throw new BadRequestException('scheduledAt inválido');
        }

        if (scheduledAt.getUTCMinutes() % SLOT_DURATION_MINUTES !== 0 || scheduledAt.getUTCSeconds() !== 0){
            throw new BadRequestException('scheduledAt precisa coincidir com um horário de slot válido');
        }
        
        const organization = await this.prisma.organization.findUnique({ where: {slug}});
        if (!organization){
            throw new NotFoundException('Organização não encontrada');
        }

        const weekday = scheduledAt.getUTCDay();
        const targetMinutes = scheduledAt.getUTCHours() * 60 + scheduledAt.getUTCMinutes();

        const availabilities = await this.prisma.availability.findMany({
            where: {organizationId: organization.id, weekday}
        })

        const withinAvailability = availabilities.some((availability) => {
            const startMinutes = availability.startTime.getUTCHours() * 60 + availability.startTime.getUTCMinutes();
            const endMinutes = availability.endTime.getUTCHours() * 60 + availability.endTime.getUTCMinutes();
            return targetMinutes >= startMinutes && targetMinutes < endMinutes;
        })

        if (!withinAvailability){
            throw new BadRequestException('horário fora da disponibilidade da organização');
        }

        let booking;

        try {
            booking = await this.prisma.booking.create({
                data: {
                    organizationId: organization.id,
                    clientName: dto.clientName,
                    clientEmail: dto.clientEmail,
                    clientPhone: dto.clientPhone,
                    scheduledAt,
                }
            });
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new ConflictException('esse horário já foi reservado')
            }
            throw error
        }

        try{
            await this.emailService.sendBookingConfirmation(booking.clientEmail, booking.clientName, booking.scheduledAt)
        } catch (error){
            console.error('Falha ao enviar e-mail de confirmação:', error)
        }
    }





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

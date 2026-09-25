import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService){}

    findAll(organizationId: string){
        return this.prisma.booking.findMany({
            where: { organizationId },
            orderBy: { scheduledAt: 'asc' },
        });
    }

    async updateStatus(id: string, organizationId: string, dto: UpdateBookingDto){
        const result = await this.prisma.booking.updateMany({
            where: { id, organizationId },
            data: { status: dto.status},
        });


        if (result.count === 0){
            throw new NotFoundException('agendamento não encontrado');
        }

        return this.prisma.booking.findUnique({ where: { id }});

    }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService){}

    findAll(organizationId: string){
        return this.prisma.booking.findMany({
            where: { organizationId },
            orderBy: { scheduledAt: 'asc' },
        });
    }
}

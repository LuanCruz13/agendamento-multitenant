import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';


@Injectable()
export class AvailabilityService {
    constructor(private readonly prisma: PrismaService){}


    create(dto: CreateAvailabilityDto, organizationId: string){
        if (new Date(dto.endTime) <= new Date(dto.startTime)){
            throw new BadRequestException('endTime precisa ser depois de startTime');
        }

        return this.prisma.availability.create({
            data: {
                weekday: dto.weekday,
                startTime: dto.startTime,
                endTime: dto.endTime,
                organizationId,
            },
        });
    }

    findAll(organizationId: string){
        return this.prisma.availability.findMany({
            where: { organizationId },
        });
    }

}

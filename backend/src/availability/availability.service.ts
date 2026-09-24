import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async update(id: string, organizationId: string, dto: CreateAvailabilityDto){
        
        if (new Date(dto.endTime) <= new Date(dto.startTime)){
            throw new BadRequestException('endTime precisa ser depois de startTime');
        }

        const result = await this.prisma.availability.updateMany({
            where: { id, organizationId},
            data: {
                weekday: dto.weekday,
                startTime: dto.startTime,
                endTime: dto.endTime,
            },
        });

        if (result.count === 0){
            throw new NotFoundException('disponibilidade não encontrada')
        }

        return this.prisma.availability.findUnique({ where: { id }});


    }

    async remove(id: string, organizationId: string){
        const result = await this.prisma.availability.deleteMany({
            where: { id, organizationId},
        });

        if(result.count === 0){
            throw new NotFoundException('disponibilidade não encontrada')
        }
    }

}

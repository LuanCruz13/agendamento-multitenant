import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';


@Injectable()
export class AvailabilityService {
    constructor(private readonly prisma: PrismaService){}

    private toMinutes(date: Date): number {
        return date.getUTCHours() * 60 + date.getUTCMinutes();
    }

    private async assertNoOverlap(organizationId: string, weekday: number, startTime: string, endTime: string, excludeId?: string){
        const existing = await this.prisma.availability.findMany({
            where: {
                organizationId,
                weekday,
                ...(excludeId ? { id: { not: excludeId } }: {}),
            },
        });

        const newStart = this.toMinutes(new Date(startTime));
        const newEnd = this.toMinutes(new Date(endTime));

        const hasOverlap = existing.some((item) => {
            const existingStart = this.toMinutes(item.startTime);
            const existingEnd = this.toMinutes(item.endTime);
            return newStart < existingEnd && existingStart < newEnd;
        });

        if (hasOverlap) {
            throw new BadRequestException('Essa faixa se sobrepõe a um horário já cadastrado nesse dia.');
        }
    }


    async create(dto: CreateAvailabilityDto, organizationId: string){
        if (new Date(dto.endTime) <= new Date(dto.startTime)){
            throw new BadRequestException('endTime precisa ser depois de startTime');
        }

        await this.assertNoOverlap(organizationId, dto.weekday, dto.startTime, dto.endTime);

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

        await this.assertNoOverlap(organizationId, dto.weekday, dto.startTime, dto.endTime, id);

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

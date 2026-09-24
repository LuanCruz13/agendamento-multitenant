import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';


@Injectable()
export class OrganizationsService {
    constructor(private readonly prisma: PrismaService){}

    async create(dto: CreateOrganizationDto){
        const passwordHash = await bcrypt.hash(dto.ownerPassword,10)
        

    try {
        return await this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: { name: dto.name, slug: dto.slug},
            });

            const owner = await tx.user.create({
                data: {
                    organizationId: organization.id,
                    name: dto.ownerName,
                    email: dto.ownerEmail,
                    passwordHash,
                    role: 'OWNER',
                },
            });

            const { passwordHash: _passwordHash, ...ownerWithoutHash } = owner;

            return { organization, owner: ownerWithoutHash};
        });
    
    } catch (error){
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
            throw new ConflictException('slug ou email já estão em uso');
        }
        throw error;
    }
}

    async update(organizationId: string, dto: UpdateOrganizationDto){
        try{
            return await this.prisma.organization.update({
                where: { id: organizationId },
                data: dto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new ConflictException('slug já está em uso')
            }
            throw error;
        }
    }

}

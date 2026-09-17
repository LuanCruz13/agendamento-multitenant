import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizationDto } from './dto/create-organization.dto';
export declare class OrganizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOrganizationDto): Promise<{
        organization: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
        };
        owner: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            refreshTokenHash: string | null;
            organizationId: string;
        };
    }>;
}

import { Controller, Post, Body, UseGuards, Patch, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

interface RequestWithUser extends Request{
    user: { sub: string; organizationId: string; role: string };
}

@Controller('organizations')
export class OrganizationsController{
    constructor (private readonly organizationsService: OrganizationsService){}


    @Post()
    create(@Body() dto: CreateOrganizationDto){
        return this.organizationsService.create(dto);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    update(@Body() dto: UpdateOrganizationDto, @Req() req: RequestWithUser){
        return this.organizationsService.update(req.user.organizationId, dto)
    }

}




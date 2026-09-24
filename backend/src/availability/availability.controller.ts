import { Controller, Get, Post, Body, Req, UseGuards, Param, Put } from '@nestjs/common';
import { Request } from 'express';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request{
    user: { sub: string; organizationId: string; role: string;}
}

@Controller('availability')
@UseGuards(JwtAuthGuard)

export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService){}

    @Post()
    create(@Body() dto: CreateAvailabilityDto, @Req() req: RequestWithUser){
        return this.availabilityService.create(dto, req.user.organizationId)
    }

    @Get()
    findAll (@Req() req: RequestWithUser){
        return this.availabilityService.findAll(req.user.organizationId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: CreateAvailabilityDto, @Req() req: RequestWithUser){
        return this.availabilityService.update(id, req.user.organizationId, dto);
    }

}


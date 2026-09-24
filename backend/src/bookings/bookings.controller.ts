import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';

interface RequestWithUser extends Request{
    user: { sub: string; organizationId: string; role: string;}
}


@Controller('bookings')
@UseGuards(JwtAuthGuard)


export class BookingsController {
    constructor(private readonly bookingService: BookingsService){}

    @Get()
    findAll (@Req() req: RequestWithUser){
        return this.bookingService.findAll(req.user.organizationId)
    }


}

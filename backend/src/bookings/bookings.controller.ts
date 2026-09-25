import { Body, Controller, Get, Param, Req, UseGuards, Patch } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';

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

    @Patch(':id')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: RequestWithUser){
        return this.bookingService.updateStatus(id, req.user.organizationId, dto);
    }


}

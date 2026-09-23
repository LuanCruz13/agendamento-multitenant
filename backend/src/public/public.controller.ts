import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('public')
export class PublicController {
    constructor (private readonly publicService: PublicService){}

    @Post(':slug/bookings')
    createBooking(@Param('slug') slug: string, @Body() dto: CreateBookingDto){
        return this.publicService.createBooking(slug, dto);
    }

    @Get(':slug/slots')
    getSlots(@Param('slug') slug: string, @Query('date') date: string){
        return this.publicService.getSlots(slug, date);
    }
}

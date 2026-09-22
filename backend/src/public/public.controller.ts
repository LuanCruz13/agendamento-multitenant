import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
    constructor (private readonly publicService: PublicService){}

    @Get(':slug/slots')
    getSlots(@Param('slug') slug: string, @Query('date') date: string){
        return this.publicService.getSlots(slug, date);
    }
}

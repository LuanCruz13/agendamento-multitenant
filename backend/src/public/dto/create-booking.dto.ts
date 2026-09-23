import { IsEmail, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto{
    @IsString()
    clientName: string;

    @IsEmail()
    clientEmail: string;

    @IsOptional()
    @IsString()
    clientPhone?: string;

    @IsISO8601()
    scheduledAt: string;


}
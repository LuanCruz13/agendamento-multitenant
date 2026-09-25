import { IsIn } from 'class-validator';




export class UpdateBookingDto {
    @IsIn(['CANCELLED'])
    status:'CANCELLED';
}
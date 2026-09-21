import { IsInt, IsISO8601, Max, Min } from 'class-validator';



export class CreateAvailabilityDto{
    @IsInt()
    @Min(0)
    @Max(6)
    weekday: number;

    @IsISO8601()
    startTime: string;

    @IsISO8601()
    endTime: string;

}
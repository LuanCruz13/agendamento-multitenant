import {IsEmail, IsString, MinLength } from 'class-validator';


export class CreateOrganizationDto{
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    ownerName: string;

    @IsEmail()
    ownerEmail: string;

    @IsString()
    @MinLength(8)
    ownerPassword: string;

}

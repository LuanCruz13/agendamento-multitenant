import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { PublicModule } from './public/public.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports:[
    ConfigModule.forRoot({isGlobal: true}), 
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    OrganizationsModule, PrismaModule, AuthModule, AvailabilityModule, PublicModule, BookingsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard},
  ],
})
export class AppModule {}

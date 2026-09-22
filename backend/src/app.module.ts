import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { PublicModule } from './public/public.module';

@Module({
  imports:[ConfigModule.forRoot({isGlobal: true}), OrganizationsModule, PrismaModule, AuthModule, AvailabilityModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

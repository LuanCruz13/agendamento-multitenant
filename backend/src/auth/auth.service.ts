import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        // achar o User por email
        private readonly prisma: PrismaService,

        // assinar os tokens (do @nestjs/jwt)
        private readonly jwtService: JwtService,

        // ler JWT_REFRESH_SECRET do .env
        private readonly configService: ConfigService,
    ){}


    async login(dto: LoginDto){
        const user = await this.prisma.user.findUnique({ where: { email: dto.email }} );
        
            if (!user){
                throw new UnauthorizedException('credenciais inválidas');
            }

        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

            if (!passwordMatches){
                throw new UnauthorizedException('credenciais inválidas');
            }

        const payload = { sub: user.id, organizationId: user.organizationId, role: user.role};

        const accessToken = await this.jwtService.signAsync(payload);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash },
        });

        return { accessToken, refreshToken };
    }
}

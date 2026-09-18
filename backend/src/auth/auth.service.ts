import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

    private hashToken(token: string): string{
        return crypto.createHash('sha256').update(token).digest('hex')
    }


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

        const refreshTokenHash = this.hashToken(refreshToken);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash },
        });

        return { accessToken, refreshToken };
    }

    async refresh(dto: RefreshTokenDto){
        let payload: { sub: string; organizationId: string; role: string };

        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException('refresh token inválido');
        }

        const user = await this.prisma.user.findUnique({ where: {id: payload.sub }});

        if(!user || !user.refreshTokenHash){
            throw new UnauthorizedException('refresh token inválido');
        }

        const tokenMatches = this.hashToken(dto.refreshToken) === user.refreshTokenHash;

        if(!tokenMatches){
            throw new UnauthorizedException('refresh token inválido');
        }

        const newPayload = { sub: user.id, organizationId: user.organizationId, role: user.role};

        const accessToken = await this.jwtService.signAsync(newPayload);

        return { accessToken };
    }


}

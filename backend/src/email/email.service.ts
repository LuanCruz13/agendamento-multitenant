import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';


@Injectable()
export class EmailService {
    private readonly resend: Resend;

    constructor(private readonly configService: ConfigService){
        this.resend = new Resend(this.configService.getOrThrow<string>('RESEND_API_KEY'));
    }

    async sendBookingConfirmation(to: string, clientName: string, scheduledAt: Date){
        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Agendamento confirmado',
            html: `<p>Olá ${clientName}, seu agendamento foi confirmado para ${scheduledAt.toISOString()}.</p>`,
        });
    }
}

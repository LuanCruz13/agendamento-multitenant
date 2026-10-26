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

    async sendPasswordReset(to: string, resetLink: string){
        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Redefinição de senha',
            html: `<p>Recebemos um pedido para redefinir sua senha. Clique no link abaixo para continuar:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Se você não pediu isso, pode ignorar este e-mail.</p>`
        });
    }

}

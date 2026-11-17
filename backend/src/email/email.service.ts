import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';


@Injectable()
export class EmailService {
    private readonly resend: Resend | undefined;

    constructor(private readonly configService: ConfigService){
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        this.resend = apiKey ? new Resend(apiKey) : undefined;
    }

    async sendBookingConfirmation(to: string, clientName: string, scheduledAt: Date){

        if (!this.resend){
            console.log(`[email] Confirmação de agendamento para ${to}: ${clientName} em ${scheduledAt.toISOString()}`);
            return;
        }


        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Agendamento confirmado',
            html: `<p>Olá ${clientName}, seu agendamento foi confirmado para ${scheduledAt.toISOString()}.</p>`,
        });
    }

    async sendPasswordReset(to: string, resetLink: string){

        if (!this.resend) {
            console.log(`[email] Link de redefinição de senha para ${to}: ${resetLink}`);
            return;
        }

        
        await this.resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject: 'Redefinição de senha',
            html: `<p>Recebemos um pedido para redefinir sua senha. Clique no link abaixo para continuar:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Se você não pediu isso, pode ignorar este e-mail.</p>`
        });
    }

}

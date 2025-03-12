import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Account } from 'src/resources/account/entities/account.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const mailOptions = {
      to: email,
      subject: 'Password Token Sent',
      template: './confirmation',
      context: {
        resetUrl: resetUrl,
        email: email,
      },
    };

    await this.mailerService.sendMail(mailOptions);
  }

  async sendResetTokenConfirmation(
    email: string,
    user: Account,
    isVerified: boolean,
  ) {
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      template: './confirmation',
      context: {
        email: `${user.email}`,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        sendResetMail: isVerified,
      },
    };

    await this.mailerService.sendMail(mailOptions);
  }
}

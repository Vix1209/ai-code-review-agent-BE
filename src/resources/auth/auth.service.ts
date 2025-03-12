import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import { MoreThan, Repository } from 'typeorm';
import { EmailValidationException } from 'utils';
import { AccountDto } from './dto/account.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async loginOrSignup(accountDto: AccountDto) {
    // Validate email
    if (!validateEmail(accountDto.email)) {
      throw new EmailValidationException();
    } else if (!accountDto.email) {
      return 'Email is required';
    }

    // Check if email is already in use
    const existingAccount = await this.accountRepository.findOne({
      where: { email: accountDto.email },
      withDeleted: true,
    });
    if (existingAccount) {
      if (existingAccount.deletedAt != null) {
        throw new ConflictException(
          `Email ${accountDto.email} belonged to a deleted account`,
        );
      } else {
        // Log in User;

        const account = await this.validateUser(accountDto);

        const payload = {
          email: account.email,
          sub: account.id,
        };

        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET_KEY,
        });

        return {
          data: {
            id: account.id,
            email: account.email,
            status: account.status,
          },
          access_token,
        };
      }
    } else {
      //Sign up user

      // Hash password
      accountDto.password = await hash(accountDto.password, 10);

      // saving user to database
      const account = this.accountRepository.create(accountDto);
      await this.accountRepository.save(account);

      const payload = {
        email: account.email,
        sub: account.id,
      };

      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_KEY,
      });

      return {
        data: {
          id: account.id,
          email: account.email,
          status: account.status,
        },
        access_token,
      };
    }
  }

  async findUserWithEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'status'],
    });

    if (!account) {
      throw new NotFoundException(`Account with email ${email} not found`);
    }

    return account;
  }

  async validateUser(dto: AccountDto) {
    const account = await this.findUserWithEmail(dto.email);

    // Check if the user's account is active
    if (account.status !== 'active') {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Validate the password

    const isPasswordValid = await compare(dto.password, account.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Exclude the password field from the result
    const { password, ...result } = account;
    return result;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.accountRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await this.accountRepository.save(user);

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}&email=${email}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, email } = resetPasswordDto;
    const user = await this.accountRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
        email: email,
      },
    });
    if (!user) {
      throw new ConflictException('Invalid or expired token');
    }

    user.password = await hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    const saved = await this.accountRepository.save(user);
    if (saved) {
      console.log('Password reset successful');
      await this.mailService.sendResetTokenConfirmation(user.email, user, true);
    }
    return;
  }
}

function validateEmail(email: string) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

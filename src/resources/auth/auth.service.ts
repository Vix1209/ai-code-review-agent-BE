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
import { Repository } from 'typeorm';
import { EmailValidationException } from 'utils';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async loginOrSignup(accountDto: AccountDto) {
    // Validate email
    if (!validateEmail(accountDto.email)) {
      throw new EmailValidationException();
    } else if (!accountDto.email) {
      return 'Email is required';
    }

    await this.validateUser(accountDto);

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
        const payload = {
          email: existingAccount.email,
          sub: existingAccount.id,
        };
        const access_token = await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.jwtSecretKey,
        });
        // return { account: { ...existingAccount, access_token } };
        return {
          account: {
            id: existingAccount.id,
            email: existingAccount.email,
            status: existingAccount.status,
          },
          access_token,
        };
      }
    } else {
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
        secret: process.env.jwtSecretKey,
      });
      return { account: account, access_token };
    }
  }

  async generateJwtToken(user: Account) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.jwtSecretKey,
    });
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

    if (!account) {
      throw new ConflictException(`Account does not exist`);
    }

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
}

function validateEmail(email: string) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

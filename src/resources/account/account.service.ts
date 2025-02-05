import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll() {
    const users = await this.accountRepository.find();
    return users;
  }

  async findOneById(id: string): Promise<Account> {
    const user = await this.accountRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDto) {
    const { currentPassword, newPassword, email } = updatePasswordDTO;

    const user = await this.accountRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Ensure currentPassword and user.password are defined
    if (!currentPassword || !user.password) {
      throw new BadRequestException('Current password is required');
    }

    // Compare currentPassword with the stored hashed password
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password strength (optional)
    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters long',
      );
    }

    // Hash the new password and update the user's password
    user.password = await hash(newPassword, 10);
    await this.accountRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async toggleAccountStatus(id: string) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status == 'active') {
      user.status = 'inactive';
    } else {
      user.status = 'active';
    }

    await this.accountRepository.save(user);

    return {
      message: `${user.status == 'active' ? `${user.email}'s account activated successfully` : `${user.email}'s account deactivated successfully`}`,
    };
  }

  async deleteAccount(id: string) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }

    await this.accountRepository.softDelete(id);
    return { message: `Account deleted successfully` };
  }

  async restoreAccount(id: string) {
    const user = await this.accountRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }

    await this.accountRepository.recover(user);
    return { message: `Account restored successfully` };
  }
}

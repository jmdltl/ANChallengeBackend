import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async registerUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.usersRepository.createUser({
        data,
      });
      return user;
    } catch (e) {
      throw e;
    }
  }
}

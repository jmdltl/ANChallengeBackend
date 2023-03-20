import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.usersRepository.getUser({
      params: {
        where: userWhereUniqueInput,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.usersRepository.getUsers({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}

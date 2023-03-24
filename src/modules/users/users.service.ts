import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma, Roles, User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {}

  async registerUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.usersRepository.createUser({
        data,
      });

      await this.authService.resetPassword(user.email);

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

  async userWithRoles(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<
    | (User & {
        roles: Roles[];
      })
    | null
  > {
    return this.usersRepository.getUserWithRoles({
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

  async editUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    delete data.password;
    return this.usersRepository.updateUser({ where, data });
  }

  async editUserEnabled(
    where: Prisma.UserWhereUniqueInput,
    enabled: boolean,
  ): Promise<User> {
    return this.usersRepository.updateUser({ where, data: { enabled } });
  }

  async updatePassword(
    where: Prisma.UserWhereUniqueInput,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      await this.usersRepository.updateUser({
        where,
        data: {
          password: hashedPassword,
        },
      });
      return new Promise((r) => r(true));
    } catch (e) {
      throw e;
    }
  }

  async getUserWithRolesAndPermissions(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.usersRepository.getUserWithRolesAndPermissions({
      params: { where },
    });
  }
}

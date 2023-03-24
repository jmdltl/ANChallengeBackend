import { Injectable } from '@nestjs/common';
import { Prisma, Roles, User } from '@prisma/client';
import { UserInfo } from 'os';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return this.prisma.user.create({ data });
  }

  async getUser({
    params,
  }: {
    params: {
      where: Prisma.UserWhereUniqueInput;
    };
  }): Promise<any> {
    const { where } = params;
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        techSkills: true,
        resumeLink: true,
        englishLevel: true,
        enabled: true,
        password: false,
      },
    });
  }

  async getUserWithRoles({
    params,
  }: {
    params: {
      where: Prisma.UserWhereUniqueInput;
    };
  }): Promise<
    | (User & {
        roles: Roles[];
      })
    | null
  > {
    const { where } = params;
    return this.prisma.user.findUnique({ where, include: { roles: true } });
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        techSkills: true,
        resumeLink: true,
        englishLevel: true,
        enabled: true,
        password: false,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({ where, data });
  }

  async getUserWithRolesAndPermissions({
    params,
  }: {
    params: {
      where: Prisma.UserWhereUniqueInput;
    };
  }): Promise<User | null> {
    const { where } = params;
    return this.prisma.user.findUnique({
      where,
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
}

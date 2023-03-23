import { Injectable } from '@nestjs/common';
import { Prisma, Roles } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  async getRoles(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RolesWhereInput;
    orderBy?: Prisma.RolesOrderByWithRelationInput;
  }): Promise<Roles[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.roles.findMany({ skip, take, where, orderBy });
  }

  async findUserRole(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;

    return this.prisma.roles.findFirst({
      where: {
        users: {
          some: where,
        },
      },
    });
  }
}

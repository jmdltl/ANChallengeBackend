import { Injectable } from '@nestjs/common';
import { Prisma, AccountAssignations, AssignationType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AssignationsRepository {
  constructor(private prisma: PrismaService) {}

  async createAssignation(params: {
    data: Prisma.AccountAssignationsUncheckedCreateInput;
  }): Promise<AccountAssignations> {
    const { data } = params;
    return this.prisma.accountAssignations.create({
      data,
    });
  }

  async getAssignations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountAssignationsWhereUniqueInput;
    where?: Prisma.AccountAssignationsWhereInput;
    orderBy?: Prisma.AccountAssignationsOrderByWithRelationInput;
  }): Promise<AccountAssignations[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.accountAssignations.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getAssignationsWithPopulatedInfo(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountAssignationsWhereUniqueInput;
    where?: Prisma.AccountAssignationsWhereInput;
    orderBy?: Prisma.AccountAssignationsOrderByWithRelationInput;
  }): Promise<AccountAssignations[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.accountAssignations.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: true,
        account: true,
      },
    });
  }

  async getAssignation({
    params,
  }: {
    params: {
      where: Prisma.AccountAssignationsWhereUniqueInput;
    };
  }): Promise<AccountAssignations | null> {
    const { where } = params;
    return this.prisma.accountAssignations.findUnique({ where });
  }

  async updateAssignation(params: {
    where: Prisma.AccountAssignationsWhereUniqueInput;
    data: Prisma.AccountAssignationsUpdateInput;
  }): Promise<AccountAssignations> {
    const { where, data } = params;
    return this.prisma.accountAssignations.update({
      where,
      data,
    });
  }
}

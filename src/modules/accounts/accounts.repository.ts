import { Injectable } from '@nestjs/common';
import { Prisma, Account } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async createAccount(params: {
    data: Prisma.AccountUncheckedCreateInput;
  }): Promise<Account> {
    const { data } = params;
    return this.prisma.account.create({ data });
  }

  async getAccount({
    params,
  }: {
    params: {
      where: Prisma.AccountWhereUniqueInput;
    };
  }): Promise<Account | null> {
    const { where } = params;
    return this.prisma.account.findUnique({ where });
  }

  async getFirstAccount({
    params,
  }: {
    params: {
      where: Prisma.AccountWhereInput;
    };
  }): Promise<Account | null> {
    const { where } = params;
    return this.prisma.account.findFirst({ where });
  }

  async getAccounts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<Account[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.account.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateAccount(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }): Promise<Account> {
    const { where, data } = params;
    return this.prisma.account.update({ where, data });
  }
}

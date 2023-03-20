import { Injectable } from '@nestjs/common';
import { Prisma, Client } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async createClient(params: {
    data: Prisma.ClientCreateInput;
  }): Promise<Client> {
    const { data } = params;
    return this.prisma.client.create({ data });
  }

  async getClient({
    params,
  }: {
    params: {
      where: Prisma.ClientWhereUniqueInput;
    };
  }): Promise<Client | null> {
    const { where } = params;
    return this.prisma.client.findUnique({ where });
  }

  async getClients(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClientWhereUniqueInput;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
  }): Promise<Client[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.client.findMany({ skip, take, cursor, where, orderBy });
  }

  async updateClient(params: {
    where: Prisma.ClientWhereUniqueInput;
    data: Prisma.ClientUpdateInput;
  }): Promise<Client> {
    const { where, data } = params;
    return this.prisma.client.update({ where, data });
  }
}

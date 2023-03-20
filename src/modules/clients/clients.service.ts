import { Injectable } from '@nestjs/common';
import { Prisma, Client } from '@prisma/client';
import { ClientsRepository } from './clients.repository';

@Injectable()
export class ClientsService {
  constructor(private clientsRepository: ClientsRepository) {}

  private transformNameToKey(name: string): string {
    return name.trim().split(' ').join('-').toLocaleLowerCase();
  }

  async registerClient(name: string) {
    const data = {
      name,
      key: this.transformNameToKey(name),
    };
    try {
      const client = await this.clientsRepository.createClient({
        data,
      });
      return client;
    } catch (e) {
      throw e;
    }
  }

  async client(
    clientWhereUniqueInput: Prisma.ClientWhereUniqueInput,
  ): Promise<Client | null> {
    return this.clientsRepository.getClient({
      params: {
        where: clientWhereUniqueInput,
      },
    });
  }

  async clients(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClientWhereUniqueInput;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
  }): Promise<Client[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.clientsRepository.getClients({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async editClient(
    where: Prisma.ClientWhereUniqueInput,
    data: Prisma.ClientUpdateInput,
  ): Promise<Client> {
    if (data.name != null)
      data.key = this.transformNameToKey(data.name as string);

    return this.clientsRepository.updateClient({ where, data });
  }

  async editClientArchived(
    where: Prisma.ClientWhereUniqueInput,
    archived: boolean,
  ): Promise<Client> {
    return this.clientsRepository.updateClient({ where, data: { archived } });
  }
}

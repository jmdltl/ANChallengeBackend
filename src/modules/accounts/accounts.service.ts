import { Injectable } from '@nestjs/common';
import { Prisma, Account } from '@prisma/client';
import { AccountsRepository } from './accounts.repository';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AccountsService {
  constructor(
    private accountsRepository: AccountsRepository,
    private usersService: UsersService,
    private clientsService: ClientsService,
  ) {}

  private transformNameToKey(name: string): string {
    return name.trim().split(' ').join('-').toLocaleLowerCase();
  }

  async registerAccount(
    data: Prisma.AccountUncheckedCreateInput,
  ): Promise<Account | Error> {
    data.key = this.transformNameToKey(data.name);

    try {
      const responsibleAccount = await this.accountsRepository.getFirstAccount({
        params: {
          where: { responsibleId: data.responsibleId },
        },
      });

      if (responsibleAccount !== null)
        throw new Error(
          'The User with the id=ResponsibleId is already responsible to an Account',
        );

      const responsibleUser = await this.usersService.user({
        id: data.responsibleId,
      });

      if (responsibleUser === null)
        throw new Error('User with id=responsibleId not found');

      const client = await this.clientsService.client({ id: data.clientId });

      if (client === null) throw new Error('Client not found');

      const account = await this.accountsRepository.createAccount({
        data,
      });
      return account;
    } catch (e) {
      throw e;
    }
  }

  async account(
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<Account | null> {
    return this.accountsRepository.getAccount({
      params: {
        where: accountWhereUniqueInput,
      },
    });
  }

  async accounts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<Account[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.accountsRepository.getAccounts({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async editAccount(
    where: Prisma.AccountWhereUniqueInput,
    data: Prisma.AccountUncheckedUpdateInput,
  ): Promise<Account | Error> {
    if (data.responsibleId) {
      const responsibleAccount = await this.accountsRepository.getFirstAccount({
        params: {
          where: { responsibleId: data.responsibleId as number },
        },
      });

      if (responsibleAccount !== null)
        throw new Error(
          'The User with the id=ResponsibleId is already responsible to an Account',
        );

      const responsibleUser = await this.usersService.user({
        id: data.responsibleId as number,
      });

      if (responsibleUser === null)
        throw new Error('User with id=responsibleId not found');
    }

    if (data.clientId) {
      const client = await this.clientsService.client({
        id: data.clientId as number,
      });

      if (client === null) throw new Error('Client not found');
    }

    if (data.name !== null)
      data.key = this.transformNameToKey(data.name as string);

    return this.accountsRepository.updateAccount({ where, data });
  }

  async editAccountArchived(
    where: Prisma.AccountWhereUniqueInput,
    archived: boolean,
  ): Promise<Account> {
    return this.accountsRepository.updateAccount({ where, data: { archived } });
  }
}

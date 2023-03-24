import { Injectable } from '@nestjs/common';
import { Prisma, AccountAssignations, AssignationType } from '@prisma/client';
import { AssignationsRepository } from './assignations.repository';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AssignationsService {
  constructor(
    private assignationsRepository: AssignationsRepository,
    private usersService: UsersService,
    private accountsService: AccountsService,
  ) {}

  async registerAssignation(
    data: Prisma.AccountAssignationsUncheckedCreateInput,
  ): Promise<AccountAssignations> {
    try {
      const { userId, accountId } = data;
      const account = await this.accountsService.account({ id: accountId });
      if (account === null)
        throw new Error('The Account with the id=accountId does not exist');

      const user = await this.usersService.user({ id: userId });
      if (user === null)
        throw new Error('The User with the id=userId does not exist');

      const existingAssignation =
        await this.assignationsRepository.getAssignations({
          where: {
            userId,
            status: true,
          },
        });

      if (existingAssignation.length > 0)
        throw new Error('The user already has an assignation to an account');

      const assignation = await this.assignationsRepository.createAssignation({
        data: {
          accountId,
          userId,
          startDate: new Date().toISOString(),
          accountAssignationsLogs: {
            create: {
              userId: userId,
              type: AssignationType.ASSIGNED,
              date: new Date().toISOString(),
            },
          },
        },
      });
      return assignation;
    } catch (e) {
      throw e;
    }
  }

  async getAssignations(params: {
    populateInfo?: boolean;
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountAssignationsWhereUniqueInput;
    where?: Prisma.AccountAssignationsWhereInput;
    orderBy?: Prisma.AccountAssignationsOrderByWithRelationInput;
  }): Promise<AccountAssignations[]> {
    const { skip, take, cursor, where, orderBy, populateInfo } = params;
    if (populateInfo)
      return await this.assignationsRepository.getAssignationsWithPopulatedInfo(
        {
          skip,
          take,
          cursor,
          where,
          orderBy,
        },
      );
    return await this.assignationsRepository.getAssignations({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async deleteAssignation(
    where: Prisma.AccountAssignationsWhereUniqueInput,
  ): Promise<AccountAssignations> {
    try {
      const { id } = where;

      const assignation = await this.assignationsRepository.getAssignation({
        params: {
          where: {
            id: Number(id),
          },
        },
      });

      if (assignation === null)
        throw new Error('The Assignation with that id does not exist');

      const updatedAssignation =
        await this.assignationsRepository.updateAssignation({
          where: { id },
          data: {
            status: false,
            endDate: new Date().toISOString(),
            accountAssignationsLogs: {
              create: {
                userId: assignation.userId,
                type: AssignationType.REMOVED,
                date: new Date().toISOString(),
              },
            },
          },
        });

      return updatedAssignation;
    } catch (e) {
      throw e;
    }
  }
}

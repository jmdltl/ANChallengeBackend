import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '../../database/prisma.service';
import { AccountsRepository } from './accounts.repository';

describe(`AccountsRepository`, () => {
  let accountsRepository: AccountsRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AccountsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    accountsRepository = moduleRef.get(AccountsRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createAccount`, () => {
    it(`Should create a new account`, async () => {
      const mockedAccountInput = {
        key: 'swang',
        name: 'Swang',
        clientId: 2,
        responsibleId: 2,
      };
      const mockedAccountOutput = {
        id: 2,
        key: 'swang',
        name: 'Swang',
        archived: true,
        clientId: 2,
        responsibleId: 2,
      };
      prismaService.account.create.mockResolvedValue(mockedAccountOutput);

      const createAccount = () =>
        accountsRepository.createAccount({
          data: mockedAccountInput,
        });

      await expect(createAccount()).resolves.toBe(mockedAccountOutput);
    });
  });

  describe(`getAccounts`, () => {
    it(`Should get list of Accounts`, async () => {
      const mockedAccounts = [
        {
          id: 3,
          key: 'swang2',
          name: 'Swang2',
          archived: true,
          clientId: 2,
          responsibleId: 2,
        },
        {
          id: 2,
          key: 'swang',
          name: 'Swang',
          archived: true,
          clientId: 2,
          responsibleId: 4,
        },
      ];
      prismaService.account.findMany.mockResolvedValue(mockedAccounts);

      const getAccount = () => accountsRepository.getAccounts({});

      await expect(getAccount()).resolves.toBe(mockedAccounts);
    });
  });

  describe(`getAccounts`, () => {
    it(`Should get an Account`, async () => {
      const mockedAccount = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
        clientId: 2,
        responsibleId: 7,
      };
      prismaService.account.findUnique.mockResolvedValue(mockedAccount);

      const getAccount = () =>
        accountsRepository.getAccount({ params: { where: { id: 31 } } });

      await expect(getAccount()).resolves.toBe(mockedAccount);
    });
  });

  describe(`updateAccount`, () => {
    it(`Should update account`, async () => {
      const mockedAccount = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
        responsibleId: 5,
        clientId: 4,
      };
      prismaService.account.update.mockResolvedValue(mockedAccount);

      const updateAccount = () =>
        accountsRepository.updateAccount({
          where: { id: 31 },
          data: mockedAccount,
        });

      await expect(updateAccount()).resolves.toBe(mockedAccount);
    });
  });
});

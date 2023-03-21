import { Test } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';

describe(`AccountsService`, () => {
  let accountsService: AccountsService;
  let accountsRepository: DeepMockProxy<AccountsRepository>;
  let usersService: DeepMockProxy<UsersService>;
  let clientsService: DeepMockProxy<ClientsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountsRepository,
        AccountsService,
        UsersService,
        ClientsService,
      ],
    })
      .overrideProvider(AccountsRepository)
      .useValue(mockDeep<AccountsRepository>())
      .overrideProvider(ClientsService)
      .useValue(mockDeep<ClientsService>())
      .overrideProvider(UsersService)
      .useValue(mockDeep<UsersService>())
      .compile();

    accountsService = moduleRef.get(AccountsService);
    usersService = moduleRef.get(UsersService);
    clientsService = moduleRef.get(ClientsService);
    accountsRepository = moduleRef.get(AccountsRepository);
  });

  describe(`registerAccount`, () => {
    const mockedAccountInput = {
      key: '',
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
    const mockedUser = {
      id: 3,
      email: 'Loren99@hotmail.com',
      firstName: 'Evan.Kozey91',
      lastName: 'Fred17',
      password: null,
      techSkills: null,
      resumeLink: null,
      englishLevel: null,
      enabled: true,
    };
    const mockedClient = {
      id: 1,
      key: 'santiago.lehner58',
      name: 'Santiago.Lehner58',
      archived: true,
    };

    it(`should fail due finding responsibleId User already has an account`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(mockedAccountOutput);

      await expect(
        accountsService.registerAccount(mockedAccountInput),
      ).rejects.toThrowError(
        'The User with the id=ResponsibleId is already responsible to an Account',
      );
    });

    it(`should fail due finding responsibleId User doesn't even exist`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(null);

      await expect(
        accountsService.registerAccount(mockedAccountInput),
      ).rejects.toThrowError('User with id=responsibleId not found');
    });

    it(`should fail due finding Client doesn't exist`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(mockedUser);
      clientsService.client.mockResolvedValue(null);

      await expect(
        accountsService.registerAccount(mockedAccountInput),
      ).rejects.toThrowError('Client not found');
    });

    it(`should registerAccount`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(mockedUser);
      clientsService.client.mockResolvedValue(mockedClient);
      accountsRepository.createAccount.mockResolvedValue(mockedAccountOutput);

      await expect(
        accountsService.registerAccount(mockedAccountInput),
      ).resolves.toBe(mockedAccountOutput);
    });

    it(`should pass the thrown error`, async () => {
      const mockedAccountInput = {
        key: '',
        name: 'Swang',
        clientId: 2,
        responsibleId: 2,
      };
      const errorMessage = 'Testing';

      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(mockedUser);
      clientsService.client.mockResolvedValue(mockedClient);
      accountsRepository.createAccount.mockRejectedValue(errorMessage);

      await expect(
        accountsService.registerAccount(mockedAccountInput),
      ).rejects.toBe(errorMessage);
    });
  });

  describe(`accounts`, () => {
    it(`should retrieve accounts`, async () => {
      const mockedAccounts = [
        {
          id: 2,
          key: 'swang',
          name: 'Swang',
          archived: true,
          clientId: 2,
          responsibleId: 2,
        },
        {
          id: 3,
          key: 'swang2',
          name: 'Swang2',
          archived: false,
          clientId: 4,
          responsibleId: 5,
        },
      ];

      accountsRepository.getAccounts.mockResolvedValue(mockedAccounts);
      const createdAccount = await accountsService.accounts({});

      expect(createdAccount).toBe(mockedAccounts);
    });
  });

  describe(`accounts`, () => {
    it(`should retrieve account`, async () => {
      const mockedAccount = {
        id: 2,
        key: 'swang',
        name: 'Swang',
        archived: true,
        clientId: 2,
        responsibleId: 2,
      };

      accountsRepository.getAccount.mockResolvedValue(mockedAccount);
      const foundAccount = await accountsService.account({});

      expect(foundAccount).toBe(mockedAccount);
    });
  });

  describe(`editAccount`, () => {
    const mockedWhereCondition = {
      id: 2,
    };
    const mockedAccountInput = {
      key: '',
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
    const mockedUser = {
      id: 3,
      email: 'Loren99@hotmail.com',
      firstName: 'Evan.Kozey91',
      lastName: 'Fred17',
      password: null,
      techSkills: null,
      resumeLink: null,
      englishLevel: null,
      enabled: true,
    };
    const mockedClient = {
      id: 1,
      key: 'santiago.lehner58',
      name: 'Santiago.Lehner58',
      archived: true,
    };

    it(`should fail due finding responsibleId User already has an account`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(mockedAccountOutput);

      await expect(
        accountsService.editAccount(mockedWhereCondition, mockedAccountInput),
      ).rejects.toThrowError(
        'The User with the id=ResponsibleId is already responsible to an Account',
      );
    });

    it(`should fail due finding responsibleId User doesn't even exist`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(null);

      await expect(
        accountsService.editAccount(mockedWhereCondition, mockedAccountInput),
      ).rejects.toThrowError('User with id=responsibleId not found');
    });

    it(`should fail due finding Client doesn't exist`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(mockedUser);
      clientsService.client.mockResolvedValue(null);

      await expect(
        accountsService.editAccount(mockedWhereCondition, mockedAccountInput),
      ).rejects.toThrowError('Client not found');
    });

    it(`should editAccount`, async () => {
      accountsRepository.getFirstAccount.mockResolvedValue(null);
      usersService.user.mockResolvedValue(mockedUser);
      clientsService.client.mockResolvedValue(mockedClient);
      accountsRepository.updateAccount.mockResolvedValue(mockedAccountOutput);

      await expect(
        accountsService.editAccount(mockedWhereCondition, mockedAccountInput),
      ).resolves.toBe(mockedAccountOutput);
    });
  });

  describe(`editAccountEnabled`, () => {
    it(`should retrieve account`, async () => {
      const mockedAccount = {
        id: 2,
        key: 'swang',
        name: 'Swang',
        archived: true,
        clientId: 2,
        responsibleId: 2,
      };
      const mockEnabled = true;
      accountsRepository.updateAccount.mockResolvedValue(mockedAccount);
      const foundAccount = await accountsService.editAccountArchived(
        mockedAccount,
        mockEnabled,
      );
      expect(foundAccount.archived).toBe(mockEnabled);
    });
  });
});

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '../../database/prisma.service';
import { ClientsRepository } from './clients.repository';

describe(`ClientsRepository`, () => {
  let clientsRepository: ClientsRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ClientsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    clientsRepository = moduleRef.get(ClientsRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createClient`, () => {
    it(`Should create a new client`, async () => {
      const mockedClientInput = {
        key: 'swang',
        name: 'Swang',
      };
      const mockedClientOutput = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };
      prismaService.client.create.mockResolvedValue(mockedClientOutput);

      const createClient = () =>
        clientsRepository.createClient({
          data: mockedClientInput,
        });

      await expect(createClient()).resolves.toBe(mockedClientOutput);
    });
  });

  describe(`getClients`, () => {
    it(`Should get list of Clients`, async () => {
      const mockedClients = [
        {
          id: 0,
          key: 'swang',
          name: 'Swang',
          archived: true,
        },
        {
          id: 1,
          key: 'swang',
          name: 'Swang',
          archived: true,
        },
      ];
      prismaService.client.findMany.mockResolvedValue(mockedClients);

      const getClient = () => clientsRepository.getClients({});

      await expect(getClient()).resolves.toBe(mockedClients);
    });
  });

  describe(`getClients`, () => {
    it(`Should get list of Clients`, async () => {
      const mockedClient = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };
      prismaService.client.findUnique.mockResolvedValue(mockedClient);

      const getClient = () =>
        clientsRepository.getClient({ params: { where: { id: 31 } } });

      await expect(getClient()).resolves.toBe(mockedClient);
    });
  });

  describe(`updateClient`, () => {
    it(`Should get list of Clients`, async () => {
      const mockedClient = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };
      prismaService.client.update.mockResolvedValue(mockedClient);

      const updateClient = () =>
        clientsRepository.updateClient({
          where: { id: 31 },
          data: mockedClient,
        });

      await expect(updateClient()).resolves.toBe(mockedClient);
    });
  });
});

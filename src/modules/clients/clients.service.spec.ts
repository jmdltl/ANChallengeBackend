import { Test } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';

describe(`Clients Service`, () => {
  let clientsService: ClientsService;
  let clientsRepository: DeepMockProxy<ClientsRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ClientsRepository, ClientsService],
    })
      .overrideProvider(ClientsRepository)
      .useValue(mockDeep<ClientsRepository>())
      .compile();

    clientsService = moduleRef.get(ClientsService);
    clientsRepository = moduleRef.get(ClientsRepository);
  });

  describe(`registerClient`, () => {
    it(`should registerClient`, async () => {
      const mockedClientInput = {
        name: 'Swang',
      };
      const mockedClientOutput = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };

      clientsRepository.createClient.mockResolvedValue(mockedClientOutput);
      const createdClient = await clientsService.registerClient(
        mockedClientInput.name,
      );

      expect(createdClient).toBe(mockedClientOutput);
    });

    it(`should pass the thrown error`, async () => {
      const mockedClientInput = {
        name: 'Swang',
      };
      const errorMessage = 'Testing';

      clientsRepository.createClient.mockRejectedValue(errorMessage);
      await expect(
        clientsService.registerClient(mockedClientInput.name),
      ).rejects.toBe(errorMessage);
    });
  });

  describe(`clients`, () => {
    it(`should retrieve clients`, async () => {
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

      clientsRepository.getClients.mockResolvedValue(mockedClients);
      const createdClient = await clientsService.clients({});

      expect(createdClient).toBe(mockedClients);
    });
  });

  describe(`clients`, () => {
    it(`should retrieve Client`, async () => {
      const mockedClient = {
        id: 0,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };

      clientsRepository.getClient.mockResolvedValue(mockedClient);
      const foundClient = await clientsService.client({});

      expect(foundClient).toBe(mockedClient);
    });
  });

  describe(`editClient`, () => {
    it(`should retrieve Client`, async () => {
      const mockedWhere = {
        id: 31,
      };
      const mockedClient = {
        id: 1,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };

      clientsRepository.updateClient.mockResolvedValue(mockedClient);
      const foundClient = await clientsService.editClient(
        mockedWhere,
        mockedClient,
      );

      expect(foundClient).toBe(mockedClient);
    });
  });

  describe(`editClientEnabled`, () => {
    it(`should retrieve Client`, async () => {
      const mockedClient = {
        id: 1,
        key: 'swang',
        name: 'Swang',
        archived: true,
      };
      const mockEnabled = true;

      clientsRepository.updateClient.mockResolvedValue(mockedClient);
      const foundClient = await clientsService.editClientArchived(
        mockedClient,
        mockEnabled,
      );

      expect(foundClient.archived).toBe(mockEnabled);
    });
  });
});

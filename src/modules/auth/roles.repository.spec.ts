import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '../../database/prisma.service';
import { RolesRepository } from './roles.respository';

describe(`RolesRepository`, () => {
  let rolesRepository: RolesRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RolesRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    rolesRepository = moduleRef.get(RolesRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`getRoles`, () => {
    it(`Should create a new client`, async () => {
      const mockedClientInput = {
        key: 'swang',
        name: 'Swang',
      };
      const mockedClientOutput = [
        {
          id: 'dc95d0f7-b885-4ba0-b4e3-42669c96a03d',
          key: 'superAdmin',
          title: null,
          description: null,
        },
        {
          id: 'fd68ac07-a6f4-4ab6-b36d-11b6d6bdc2e7',
          key: 'admmin',
          title: null,
          description: null,
        },
      ];
      prismaService.roles.findMany.mockResolvedValue(mockedClientOutput);

      const createClient = () => rolesRepository.getRoles({ take: 100 });

      await expect(createClient()).resolves.toBe(mockedClientOutput);
    });
  });
});

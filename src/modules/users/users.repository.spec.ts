import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { PrismaService } from '../../database/prisma.service';
import { UsersRepository } from './users.repository';

describe(`UsersRepository`, () => {
  let usersRepository: UsersRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersRepository = moduleRef.get(UsersRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createUser`, () => {
    it(`Should create a new user`, async () => {
      const mockedUserInput = {
        email: 'mock@test.com',
        firstName: 'mock',
        lastName: 'test',
      };
      const mockedUserOutput = {
        id: 0,
        email: 'mock@test.com',
        firstName: 'mock',
        lastName: 'test',
        password: null,
        techSkills: null,
        resumeLink: null,
        englishLevel: null,
        enabled: true,
      };
      prismaService.user.create.mockResolvedValue(mockedUserOutput);

      const createUser = () =>
        usersRepository.createUser({
          data: mockedUserInput,
        });

      await expect(createUser()).resolves.toBe(mockedUserOutput);
    });
  });
});

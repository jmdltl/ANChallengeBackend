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

  describe(`getUsers`, () => {
    it(`Should get list of Users`, async () => {
      const mockedUsers = [
        {
          id: 31,
          email: 'Jackeline_Walsh19@gmail.com',
          firstName: 'Justyn.Price',
          lastName: 'Hadley_Greenholt98',
          password: null,
          techSkills: null,
          resumeLink: null,
          englishLevel: null,
          enabled: true,
        },
        {
          id: 32,
          email: 'Lionel.Greenfelder29@hotmail.com',
          firstName: 'Kailey65',
          lastName: 'Lilly.Nikolaus',
          password: null,
          techSkills: null,
          resumeLink: null,
          englishLevel: null,
          enabled: true,
        },
      ];
      prismaService.user.findMany.mockResolvedValue(mockedUsers);

      const getUser = () => usersRepository.getUsers({});

      await expect(getUser()).resolves.toBe(mockedUsers);
    });
  });

  describe(`getUsers`, () => {
    it(`Should get list of Users`, async () => {
      const mockedUser = {
        id: 31,
        email: 'Jackeline_Walsh19@gmail.com',
        firstName: 'Justyn.Price',
        lastName: 'Hadley_Greenholt98',
        password: null,
        techSkills: null,
        resumeLink: null,
        englishLevel: null,
        enabled: true,
      };
      prismaService.user.findUnique.mockResolvedValue(mockedUser);

      const getUser = () =>
        usersRepository.getUser({ params: { where: { id: 31 } } });

      await expect(getUser()).resolves.toBe(mockedUser);
    });
  });
});

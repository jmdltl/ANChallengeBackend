import { Test } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe(`UsersRepository`, () => {
  let usersService: UsersService;
  let usersRepository: DeepMockProxy<UsersRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, UsersService],
    })
      .overrideProvider(UsersRepository)
      .useValue(mockDeep<UsersRepository>())
      .compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe(`registerUser`, () => {
    it(`should registerUser`, async () => {
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

      usersRepository.createUser.mockResolvedValue(mockedUserOutput);
      const createdUser = await usersService.registerUser(mockedUserInput);

      expect(createdUser).toBe(mockedUserOutput);
    });

    it(`should pass the thrown error`, async () => {
      const mockedUserInput = {
        email: 'mock@test.com',
        firstName: 'mock',
        lastName: 'test',
      };
      const errorMessage = 'Testing';

      usersRepository.createUser.mockRejectedValue(errorMessage);
      await expect(usersService.registerUser(mockedUserInput)).rejects.toBe(
        errorMessage,
      );
    });
  });

  describe(`users`, () => {
    it(`should retrieve users`, async () => {
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

      usersRepository.getUsers.mockResolvedValue(mockedUsers);
      const createdUser = await usersService.users({});

      expect(createdUser).toBe(mockedUsers);
    });
  });

  describe(`users`, () => {
    it(`should retrieve user`, async () => {
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

      usersRepository.getUser.mockResolvedValue(mockedUser);
      const foundUser = await usersService.user({});

      expect(foundUser).toBe(mockedUser);
    });
  });
});

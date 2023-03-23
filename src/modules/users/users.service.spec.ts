import { Test } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

describe(`UsersService`, () => {
  let usersService: UsersService;
  let usersRepository: DeepMockProxy<UsersRepository>;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [UsersRepository, UsersService],
    })
      .overrideProvider(UsersRepository)
      .useValue(mockDeep<UsersRepository>())
      .overrideProvider(AuthService)
      .useValue(mockDeep<AuthService>())
      .compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(UsersRepository);
    authService = moduleRef.get(AuthService);
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

      authService.resetPassword.mockResolvedValue(true);
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

  describe(`editUser`, () => {
    it(`should retrieve user`, async () => {
      const mockedWhere = {
        id: 31,
      };
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

      usersRepository.updateUser.mockResolvedValue(mockedUser);
      const foundUser = await usersService.editUser(mockedWhere, mockedUser);

      expect(foundUser).toBe(mockedUser);
    });
  });

  describe(`editUserEnabled`, () => {
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
      const mockEnabled = true;

      usersRepository.updateUser.mockResolvedValue(mockedUser);
      const foundUser = await usersService.editUserEnabled(
        mockedUser,
        mockEnabled,
      );

      expect(foundUser.enabled).toBe(mockEnabled);
    });
  });

  describe(`updatePassword`, () => {
    it(`should retrieve user`, async () => {
      const mockedWhere = {
        id: 31,
      };
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

      usersRepository.updateUser.mockResolvedValue(mockedUser);
      const foundUser = await usersService.updatePassword(
        { id: 1 },
        'HashedPass',
      );

      expect(foundUser).toBe(true);
    });

    it(`should return thrown error`, async () => {
      const mockedWhere = {
        id: 31,
      };
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

      usersRepository.updateUser.mockRejectedValue('TEST');

      await expect(
        usersService.updatePassword({ id: 1 }, 'HashedPass'),
      ).rejects.toBe('TEST');
    });
  });

  describe(`getUserWithRolesAndPermissions`, () => {
    it(`should retrieve user`, async () => {
      const mockedWhere = {
        id: 31,
      };
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
        roles: [],
      };

      usersRepository.getUserWithRolesAndPermissions.mockResolvedValue(
        mockedUser,
      );
      const foundUser = await usersService.getUserWithRolesAndPermissions({
        id: 1,
      });

      expect(foundUser).toBe(mockedUser);
    });
  });
});

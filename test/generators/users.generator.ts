import { faker } from '@faker-js/faker';
import { UserDTO } from '../../src/api/controllers/users/dto/createUser.dto';
import { EnglishLevel } from '@prisma/client';
import { PatchUserDTO } from 'src/api/controllers/users/dto/patchUser.dto';

export const generatePostUserData = (): UserDTO => {
  return {
    email: faker.internet.email(),
    firstName: faker.internet.userName(),
    lastName: faker.internet.userName(),
  };
};

export const generatePatchUserData = (): PatchUserDTO => {
  return {
    firstName: faker.internet.userName(),
    lastName: faker.internet.userName(),
    techSkills: faker.random.word(),
    resumeLink: faker.random.word(),
    englishLevel: EnglishLevel.A2,
  };
};

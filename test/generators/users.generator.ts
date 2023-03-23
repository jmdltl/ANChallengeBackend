import { faker } from '@faker-js/faker';
import { PostUserDTO } from '../../src/api/controllers/users/dto/createUser.dto';
import { EnglishLevel } from '@prisma/client';
import { PatchUserDTO } from '../../src/api/controllers/users/dto/patchUser.dto';
import * as bcrypt from 'bcrypt';

export const generatePostUserData = (): PostUserDTO => {
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

export const generateHashedPassword = async (
  password: string,
): Promise<string> => {
  return await bcrypt.hash(
    password,
    Number(process.env.HASH_SALT_ROUNDS || 10),
  );
};

export const compareHashedPassword = async (
  hashedPassword: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(hashedPassword, password);
};

import { faker } from '@faker-js/faker';
import { UserDTO } from '../../src/api/controllers/users/dto/createUser.dto';

export const generatePostUserData = (): UserDTO => {
  return {
    email: faker.internet.email(),
    firstName: faker.internet.userName(),
    lastName: faker.internet.userName(),
  };
};

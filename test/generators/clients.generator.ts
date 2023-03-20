import { faker } from '@faker-js/faker';
import { PatchClientDTO } from '../../src/api/controllers/clients/dto/patchClient.dto';
import { PostClientDTO } from '../../src/api/controllers/clients/dto/createClient.dto';

export const generatePostClientData = (): PostClientDTO => {
  return {
    name: faker.internet.userName(),
  };
};

export const generatePatchClientData = (): PatchClientDTO => {
  return {
    name: faker.internet.userName(),
  };
};

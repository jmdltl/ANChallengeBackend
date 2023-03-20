import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ApiUsersController } from './controllers/users/api.users.controller';
import { ClientsModule } from '../modules/clients/clients.module';
import { ApiClientsController } from './controllers/clients/api.clients.controller';

@Module({
  imports: [UsersModule, ClientsModule],
  controllers: [ApiUsersController, ApiClientsController],
})
export class ApiModule {}

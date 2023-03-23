import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ApiUsersController } from './controllers/users/api.users.controller';
import { ClientsModule } from '../modules/clients/clients.module';
import { ApiClientsController } from './controllers/clients/api.clients.controller';
import { AccountsModule } from '../modules/accounts/accounts.module';
import { ApiAccountsController } from './controllers/accounts/api.accounts.controller';
import { AuthModule } from '../modules/auth/auth.module';
import { ApiAuthController } from './controllers/auth/api.auth.controller';

@Module({
  imports: [UsersModule, ClientsModule, AccountsModule, AuthModule],
  controllers: [
    ApiUsersController,
    ApiClientsController,
    ApiAccountsController,
    ApiAuthController,
  ],
})
export class ApiModule {}

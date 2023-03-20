import { Module } from '@nestjs/common';
import { ApiUsersController } from './controllers/users/api.users.controller';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ApiUsersController],
})
export class ApiModule {}

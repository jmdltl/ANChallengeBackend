import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AssignationsRepository } from './assignations.repository';
import { AssignationsService } from './assignations.service';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, AccountsModule],
  providers: [AssignationsService, AssignationsRepository],
  exports: [AssignationsService],
})
export class AssignationsModule {}

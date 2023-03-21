import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';
import { UsersModule } from '../users/users.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [PrismaModule, UsersModule, ClientsModule],
  providers: [AccountsRepository, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}

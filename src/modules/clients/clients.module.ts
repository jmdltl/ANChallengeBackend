import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';

@Module({
  imports: [PrismaModule],
  providers: [ClientsRepository, ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}

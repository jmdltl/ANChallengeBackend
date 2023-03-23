import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

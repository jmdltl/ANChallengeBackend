import { Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { ApiModule } from './api/api.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    UsersModule,
    ApiModule,
    PrismaModule,
    ClientsModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

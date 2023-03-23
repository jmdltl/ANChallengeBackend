import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesRepository } from './roles.respository';
import { PasswordTokenRepository } from './passwordToken.repository';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../database/prisma.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthorizationGuard } from './authorization.guard';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_SECRET',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [
    RolesRepository,
    PasswordTokenRepository,
    AuthService,
    JwtStrategy,
    AuthorizationGuard,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, AuthorizationGuard],
})
export class AuthModule {}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: process.env.JWT_SECRET || 'JWT_SECRET',
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<User | null> {
    const { jwt } = payload;
    const getUserWithRolesAndPermissions =
      await this.authService.getUserRolesPermissions({
        where: { id: jwt.user.id },
      });

    if (!getUserWithRolesAndPermissions) throw new UnauthorizedException();

    return getUserWithRolesAndPermissions;
  }
}

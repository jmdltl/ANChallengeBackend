import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Roles, User } from '@prisma/client';

import { PasswordTokenRepository } from './passwordToken.repository';
import { RolesRepository } from './roles.respository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordTokenRepository: PasswordTokenRepository,
    private rolesRepository: RolesRepository,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const errorMessage = 'The credentials do not match with any user';
    const user = await this.usersService.user({ email });
    if (!user) throw new Error(errorMessage);
    if (!user.enabled) throw new Error('User is disabled, reach administrator');

    const match = await bcrypt.compare(password, user.password as string);
    if (!match) throw Error(errorMessage);

    const payload = {
      jwt: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
    const accessToken: string = await this.jwtService.sign(payload);
    return accessToken;
  }

  async resetPassword(email: string): Promise<boolean> {
    const user = await this.usersService.user({ email });

    if (!user) throw new NotFoundException();
    //86400000 === 1000 * 60 * 60 * 24; for a day of expiration
    const expirationDate = new Date(
      Date.now() + Number(process.env.PASSWORD_TOKEN_EXPIRATION || 86400000),
    ).toISOString();

    await this.passwordTokenRepository.createPasswordToken({
      data: {
        userId: user.id,
        expirationDate: expirationDate,
      },
    });

    // @TODO send email

    return new Promise((r) => r(true));
  }

  async updatePassword(password: string, uuid: string): Promise<boolean> {
    try {
      const passwordToken = await this.passwordTokenRepository.getPasswordToken(
        {
          where: { id: uuid },
        },
      );

      if (!passwordToken) throw new Error('Token does not exist');

      const newDate = new Date();
      if (new Date(passwordToken.expirationDate) < newDate)
        throw new Error('Token has expired');

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.HASH_SALT_ROUNDS || 10),
      );

      await this.usersService.updatePassword(
        { id: passwordToken.userId },
        hashedPassword,
      );

      this.passwordTokenRepository.updatePasswordToken({
        where: { id: passwordToken.id },
        data: { expirationDate: newDate.toISOString() },
      });

      return new Promise((r) => r(true));
    } catch (e) {
      throw e;
    }
  }

  async getRoles(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RolesWhereInput;
    orderBy?: Prisma.RolesOrderByWithRelationInput;
  }): Promise<Roles[]> {
    return this.rolesRepository.getRoles(params);
  }

  async getUserRolesPermissions(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User | null> {
    const user = this.usersService.getUserWithRolesAndPermissions(params.where);
    return user;
  }
}

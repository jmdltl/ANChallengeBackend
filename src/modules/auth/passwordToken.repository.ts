import { Injectable } from '@nestjs/common';
import { Prisma, PasswordToken } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PasswordTokenRepository {
  constructor(private prisma: PrismaService) {}

  async createPasswordToken(params: {
    data: Prisma.PasswordTokenUncheckedCreateInput;
  }) {
    const { data } = params;
    return this.prisma.passwordToken.create({ data });
  }

  async getPasswordToken(params: {
    where: Prisma.PasswordTokenWhereUniqueInput;
  }) {
    const { where } = params;
    return this.prisma.passwordToken.findUnique({ where });
  }

  async updatePasswordToken(params: {
    where: Prisma.PasswordTokenWhereUniqueInput;
    data: Prisma.PasswordTokenUpdateInput;
  }): Promise<PasswordToken | null> {
    const { where, data } = params;
    return this.prisma.passwordToken.update({ where, data });
  }
}

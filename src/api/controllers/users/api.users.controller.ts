import {
  Controller,
  Post,
  Body,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../../../modules/users/users.service';
import { UserDTO } from './dto/createUser.dto';
import { UserEntity } from './user.entity';

@ApiTags('Users')
@Controller({
  path: 'api/users',
  version: '0.1',
})
export class ApiUsersController {
  constructor(
    private usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiCreatedResponse({
    description: 'User created',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Email already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Sever erroed, try again later',
  })
  @Post()
  async registerUser(@Body() userData: UserDTO) {
    try {
      const user = await this.usersService.registerUser(userData);
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Email is already registered');

        const uuid = uuidv4();
        this.logger.error(
          `Api Users Controller, registerUser, error id: ${uuid} error: ${JSON.stringify(
            e,
          )}`,
        );

        throw new InternalServerErrorException({
          description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
          errorId: uuid,
        });
      }
    }
  }
}

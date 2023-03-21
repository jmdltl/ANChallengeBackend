import {
  Controller,
  Post,
  Body,
  Inject,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { UsersService } from '../../../modules/users/users.service';
import { PostUserDTO } from './dto/createUser.dto';
import { SkipAndTakeQueryParams } from '../../common/dto/SkipAndTakeQueryParams.dto';
import { UserEntity } from './user.entity';
import { IdPathParam } from '../../common/dto/IdParam.dto';
import { PatchUserDTO } from './dto/patchUser.dto';
import { PatchUserEnabled } from './dto/patchUserEnabled.dto';

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
    description: 'Server failed, try again later',
  })
  @Post()
  async registerUser(@Body() userData: PostUserDTO) {
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

  @ApiOkResponse({
    description: 'Users found',
    type: [UserEntity],
  })
  @ApiBadRequestResponse({
    description: 'Wrong query params',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get()
  async getUsers(@Query() query: SkipAndTakeQueryParams) {
    try {
      const users = await this.usersService.users(query);
      return users;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Users Controller, getUsers, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
          errorId: uuid,
        });
      }
    }
  }

  @ApiOkResponse({
    description: 'User found',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get(':id')
  async getUser(@Param() params: IdPathParam) {
    try {
      const user = await this.usersService.user({
        id: params.id,
      });
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      const uuid = uuidv4();
      this.logger.error(
        `Api Users Controller, getUser, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
          errorId: uuid,
        });
      }
    }
  }

  @ApiOkResponse({
    description: 'User updated',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id')
  async patchUser(@Param() params: IdPathParam, @Body() body: PatchUserDTO) {
    try {
      const user = await this.usersService.editUser(
        {
          id: params.id,
        },
        body,
      );
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Users Controller, patchUser, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
          errorId: uuid,
        });
      }
    }
  }

  @ApiOkResponse({
    description: 'User found',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id/enabled')
  async PatchUserEnabled(
    @Param() params: IdPathParam,
    @Body() body: PatchUserEnabled,
  ) {
    try {
      const user = await this.usersService.editUserEnabled(
        { id: params.id },
        body.enabled,
      );
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Users Controller, getUser, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
          errorId: uuid,
        });
      }
    }
  }
}

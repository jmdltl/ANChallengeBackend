import {
  Controller,
  Post,
  Body,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  Get,
  Query,
  Patch,
  ConflictException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport';

import { SkipAndTakeQueryParams } from '../../common/dto/SkipAndTakeQueryParams.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { ResetPasswordDTO } from './dto/resetPassword.dto';
import { AuthService } from '../../../modules/auth/auth.service';
import { RolesEntity } from './role.entity';
import { LoginDTO } from './dto/login.dto';
import { PERMISSIONS } from '../../../config/permissionsAndRoles';
import { AuthorizationGuard } from '../../../modules/auth/authorization.guard';

@ApiTags('Auth')
@Controller({
  path: 'api/auth',
  version: '0.1',
})
export class ApiAuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOkResponse({
    description: 'Password updated',
  })
  @ApiConflictResponse({
    description: 'Something went wrong with the password token',
  })
  @Patch('/password')
  async updatePassword(@Body() body: UpdatePasswordDTO): Promise<void> {
    try {
      const didPasswordUpdate = await this.authService.updatePassword(
        body.password,
        body.uuid,
      );
      if (!didPasswordUpdate)
        throw new Error('Something went wrong saving the password');
      return;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Auth Controller, registerUser, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      throw new ConflictException({
        description: `Something worng with the password token, please request a new reset, reference uuid: ${uuid}, please reach out to support if you still have problems.`,
        errorId: uuid,
      });
    }
  }

  @ApiOkResponse({
    description: 'Password reseted',
  })
  @ApiNotFoundResponse({
    description: 'Email is not registered',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Post('/resetpassword')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    try {
      const user = await this.authService.resetPassword(body.email);
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Auth Controller, patchUser, error id: ${uuid} error: ${JSON.stringify(
          e,
        )}`,
      );

      throw new InternalServerErrorException({
        description: `Unexpected error, reference uuid: ${uuid}, please reach out to support.`,
        errorId: uuid,
      });
    }
  }

  @ApiOkResponse({
    description: 'Login successful',
  })
  @ApiNotFoundResponse({
    description: 'Credentials do not match with any users',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Post('/login')
  async PatchUserEnabled(@Body() body: LoginDTO) {
    try {
      const user = await this.authService.login(body.email, body.password);
      if (!user) throw new NotFoundException();
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Auth Controller, getUser, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Roles found',
    type: [RolesEntity],
  })
  @ApiBadRequestResponse({
    description: 'Wrong query params',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @SetMetadata('requiredPermission', PERMISSIONS.ROLES.READ)
  @UseGuards(AuthGuard(), AuthorizationGuard)
  @Get('/roles')
  async getRoles(@Query() query: SkipAndTakeQueryParams) {
    try {
      const roles = await this.authService.getRoles(query);
      return roles;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Auth Controller, getUsers, error id: ${uuid} error: ${JSON.stringify(
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

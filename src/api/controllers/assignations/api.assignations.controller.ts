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
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { Prisma, AccountAssignations } from '@prisma/client';
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

import { GetAssignationsQueryParams } from './dto/getAssignations.dto';
import { IdPathParam } from '../../common/dto/IdParam.dto';
import { PostAssignationDTO } from './dto/createAssignation.dto';
import { AssignationEntity } from './assignation.entity';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS } from '../../..//config/permissionsAndRoles';
import { AuthorizationGuard } from '../../..//modules/auth/authorization.guard';
import { AssignationsService } from 'src/modules/assignations/assignations.service';

@ApiTags('Assignations')
@Controller({
  path: 'api/assignations',
  version: '0.1',
})
export class ApiAssignationsController {
  constructor(
    private assignationsService: AssignationsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiCreatedResponse({
    description: 'Assignation created',
    type: AssignationEntity,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @SetMetadata('requiredPermission', PERMISSIONS.ASSIGNATIONS.CREATE)
  @UseGuards(AuthGuard(), AuthorizationGuard)
  @Post()
  async registerAssignation(@Body() body: PostAssignationDTO) {
    try {
      const assignation = await this.assignationsService.registerAssignation(
        body,
      );
      return assignation;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Assignation was already registered');
      }

      switch (e.message) {
        case 'The Account with the id=accountId does not exist':
        case 'The User with the id=userId does not exist':
          throw new NotFoundException(e.message);
      }

      if (e.message === 'The user already has an assignation to an account')
        throw new BadRequestException(e.message);

      const uuid = uuidv4();
      this.logger.error(
        `Api Assignations Controller, registerAssignation, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Assignations found',
    type: [AssignationEntity],
  })
  @ApiBadRequestResponse({
    description: 'Wrong query params',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @SetMetadata('requiredPermission', PERMISSIONS.ASSIGNATIONS.READ)
  @UseGuards(AuthGuard(), AuthorizationGuard)
  @Get()
  async getAssignations(@Query() query: GetAssignationsQueryParams) {
    const { take, skip, populateInfo } = query;
    const where: Prisma.AccountAssignationsWhereInput = {};

    if (query.userName)
      where.user = {
        OR: [
          {
            firstName: {
              contains: query.userName,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query.userName,
              mode: 'insensitive',
            },
          },
        ],
      };

    if (query.accountName)
      where.account = {
        name: {
          contains: query.accountName,
        },
      };

    if (query.minEndDate || query.maxEndDate) {
      where.endDate = {};
      if (query.minEndDate) where.endDate.gte = query.minEndDate;
      if (query.maxEndDate) where.endDate.lte = query.maxEndDate;
    }

    if (query.minStartDate || query.maxStartDate) {
      where.startDate = {};
      if (query.minStartDate) where.startDate.gte = query.minStartDate;
      if (query.maxStartDate) where.startDate.lte = query.maxStartDate;
    }

    const orderBy: Prisma.AccountAssignationsOrderByWithRelationInput = {};
    let sortBy: Prisma.SortOrder;

    if (query.sortOrder) {
      switch (query.sortOrder) {
        case 'asc':
          sortBy = 'asc';
          break;
        case 'desc':
          sortBy = 'desc';
          break;
        default:
          sortBy = 'desc';
      }
    } else {
      sortBy = 'desc';
    }

    if (query.sortBy) {
      switch (query.sortBy) {
        case 'userName':
          orderBy.user = {
            firstName: sortBy,
          };
          break;
        case 'accountName':
          orderBy.account = {
            name: sortBy,
          };
          break;
        case 'startDate':
          orderBy.startDate = sortBy;
          break;
        case 'endDate':
          orderBy.endDate = sortBy;
          break;
      }
    } else {
      orderBy.endDate = 'desc';
    }
    try {
      const assignations = await this.assignationsService.getAssignations({
        where,
        orderBy,
        take,
        skip,
        populateInfo,
      });
      return assignations;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Assignations Controller, getAssignations, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Assignation updated',
    type: AssignationEntity,
  })
  @ApiNotFoundResponse({
    description: 'Assignation not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @SetMetadata('requiredPermission', PERMISSIONS.ASSIGNATIONS.UPDATE)
  @UseGuards(AuthGuard(), AuthorizationGuard)
  @Patch(':id')
  async patchAssignation(@Param() params: IdPathParam) {
    try {
      const assignation = await this.assignationsService.deleteAssignation({
        id: params.id,
      });
      if (!assignation) throw new NotFoundException();
      return assignation;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      if (e.message === 'The Assignation with that id does not exist')
        throw new NotFoundException(e.message);

      const uuid = uuidv4();
      this.logger.error(
        `Api Assignations Controller, patchAssignation, error id: ${uuid} error: ${JSON.stringify(
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

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

import { ClientsService } from '../../../modules/clients/clients.service';
import { ClientEntity } from './client.entity';
import { PostClientDTO } from './dto/createClient.dto';
import { SkipAndTakeQueryParams } from '../../common/dto/SkipAndTakeQueryParams.dto';
import { IdPathParam } from '../../common/dto/IdParam.dto';
import { PatchClientDTO } from './dto/patchClient.dto';
import { PatchClientArchived } from './dto/patchClientArchived.dto';

@ApiTags('Clients')
@Controller({
  path: 'api/clients',
  version: '0.1',
})
export class ApiClientsController {
  constructor(
    private clientsService: ClientsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiCreatedResponse({
    description: 'Client created',
    type: ClientEntity,
  })
  @ApiBadRequestResponse({
    description: 'Client name already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Post()
  async registerClient(@Body() body: PostClientDTO) {
    try {
      const client = await this.clientsService.registerClient(body.name);
      return client;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Client already exists');

        const uuid = uuidv4();
        this.logger.error(
          `Api Clients Controller, registerClient, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Clients found',
    type: [ClientEntity],
  })
  @ApiBadRequestResponse({
    description: 'Wrong query params',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get()
  async getClients(@Query() query: SkipAndTakeQueryParams) {
    try {
      const clients = await this.clientsService.clients(query);
      return clients;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Clients Controller, getClients, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Client found',
    type: ClientEntity,
  })
  @ApiNotFoundResponse({
    description: 'Client not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get(':id')
  async getClient(@Param() params: IdPathParam) {
    try {
      const client = await this.clientsService.client({
        id: params.id,
      });
      if (!client) throw new NotFoundException();
      return client;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      const uuid = uuidv4();
      this.logger.error(
        `Api Clients Controller, getClient, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Client found',
    type: ClientEntity,
  })
  @ApiNotFoundResponse({
    description: 'Client not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id')
  async patchClient(
    @Param() params: IdPathParam,
    @Body() body: PatchClientDTO,
  ) {
    try {
      const client = await this.clientsService.editClient(
        {
          id: params.id,
        },
        body,
      );
      if (!client) throw new NotFoundException();
      return client;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Clients Controller, patchClient, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Client found',
    type: ClientEntity,
  })
  @ApiNotFoundResponse({
    description: 'Client not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id/archived')
  async PatchClientArchived(
    @Param() params: IdPathParam,
    @Body() body: PatchClientArchived,
  ) {
    try {
      const client = await this.clientsService.editClientArchived(
        { id: params.id },
        body.archived,
      );
      if (!client) throw new NotFoundException();
      return client;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Clients Controller, getClient, error id: ${uuid} error: ${JSON.stringify(
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

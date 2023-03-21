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

import { AccountsService } from 'src/modules/accounts/accounts.service';
import { AccountEntity } from './account.entity';
import { SkipAndTakeQueryParams } from '../../common/dto/SkipAndTakeQueryParams.dto';
import { IdPathParam } from '../../common/dto/IdParam.dto';
import { PostAccountDTO } from './dto/createAccount.dto';
import { PatchAccountDTO } from './dto/patchAccount.dto';
import { PatchAccountArchivedDTO } from './dto/patchAccountArchived.dto';

@ApiTags('Accounts')
@Controller({
  path: 'api/accounts',
  version: '0.1',
})
export class ApiAccountsController {
  constructor(
    private accountsService: AccountsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiCreatedResponse({
    description: 'Account created',
    type: AccountEntity,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Post()
  async registerAccount(@Body() body: PostAccountDTO) {
    try {
      const account = await this.accountsService.registerAccount({
        ...body,
        key: '',
      });
      return account;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Account is already registered');
      }

      switch (e.message) {
        case 'The User with the id=ResponsibleId is already responsible to an Account':
        case 'User with id=responsibleId not found':
        case 'Client not found':
          throw new NotFoundException(e.message);
      }

      const uuid = uuidv4();
      this.logger.error(
        `Api Accounts Controller, registerAccount, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Accounts found',
    type: [AccountEntity],
  })
  @ApiBadRequestResponse({
    description: 'Wrong query params',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get()
  async getAccounts(@Query() query: SkipAndTakeQueryParams) {
    try {
      const accounts = await this.accountsService.accounts(query);
      return accounts;
    } catch (e) {
      const uuid = uuidv4();
      this.logger.error(
        `Api Accounts Controller, getAccounts, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Account found',
    type: AccountEntity,
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Get(':id')
  async getAccount(@Param() params: IdPathParam) {
    try {
      const account = await this.accountsService.account({
        id: params.id,
      });
      if (!account) throw new NotFoundException();
      return account;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      const uuid = uuidv4();
      this.logger.error(
        `Api Accounts Controller, getAccount, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Account updated',
    type: AccountEntity,
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id')
  async patchAccount(
    @Param() params: IdPathParam,
    @Body() body: PatchAccountDTO,
  ) {
    try {
      const account = await this.accountsService.editAccount(
        {
          id: params.id,
        },
        body,
      );
      if (!account) throw new NotFoundException();
      return account;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      switch (e.message) {
        case 'The User with the id=ResponsibleId is already responsible to an Account':
        case 'User with id=responsibleId not found':
        case 'Client not found':
          throw new NotFoundException(e.message);
      }

      const uuid = uuidv4();
      this.logger.error(
        `Api Accounts Controller, patchAccount, error id: ${uuid} error: ${JSON.stringify(
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
    description: 'Account found',
    type: AccountEntity,
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server failed, try again later',
  })
  @Patch(':id/archived')
  async PatchAccountArchived(
    @Param() params: IdPathParam,
    @Body() body: PatchAccountArchivedDTO,
  ) {
    try {
      const account = await this.accountsService.editAccountArchived(
        { id: params.id },
        body.archived,
      );
      if (!account) throw new NotFoundException();
      return account;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;

      if (e.code === 'P2025') throw new NotFoundException();

      const uuid = uuidv4();
      this.logger.error(
        `Api Accounts Controller, getAccount, error id: ${uuid} error: ${JSON.stringify(
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

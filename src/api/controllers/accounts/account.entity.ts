import { ApiProperty } from '@nestjs/swagger';
import { Account as AccountModel } from '@prisma/client';

export class AccountEntity implements AccountModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clientId: number;

  @ApiProperty()
  responsibleId: number;

  @ApiProperty()
  archived: boolean;
}

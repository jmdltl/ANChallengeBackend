import { ApiProperty } from '@nestjs/swagger';
import { Client as ClientModel } from '@prisma/client';

export class ClientEntity implements ClientModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  archived: boolean;
}

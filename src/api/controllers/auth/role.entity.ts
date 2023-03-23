import { ApiProperty } from '@nestjs/swagger';
import { Roles as RolesModel } from '@prisma/client';

export class RolesEntity implements RolesModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string | null;

  @ApiProperty()
  description: string | null;
}

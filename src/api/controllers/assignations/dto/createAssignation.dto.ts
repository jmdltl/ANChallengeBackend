import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from 'src/utils/cast.helper';

export class PostAssignationDTO {
  @ApiProperty({
    description: 'The id of the Account',
    example: 5,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: 'The id of the User to join the Account',
    example: 5,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  userId: number;
}

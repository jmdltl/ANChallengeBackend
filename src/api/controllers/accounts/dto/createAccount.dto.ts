import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from '../../../../utils/cast.helper';

export class PostAccountDTO {
  @ApiProperty({
    description: 'The name of the Account',
    example: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The id of the Client who belongs to the Account',
    example: 5,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  clientId: number;

  @ApiProperty({
    description: 'The id of the User who is responsible to the Account',
    example: 5,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  responsibleId: number;
}

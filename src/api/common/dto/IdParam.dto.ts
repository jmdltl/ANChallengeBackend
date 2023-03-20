import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from '../../../utils/cast.helper';

export class IdPathParam {
  @ApiProperty({
    description: 'User id',
    example: 100,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  public id: number;
}

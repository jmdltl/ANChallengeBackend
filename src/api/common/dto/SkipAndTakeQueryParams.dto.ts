import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toNumber } from '../../../utils/cast.helper';

export class SkipAndTakeQueryParams {
  @ApiProperty({
    description: 'Number of records to skip before selecting',
    example: 0,
  })
  @Transform(({ value }) => toNumber(value))
  @IsNumber()
  @IsOptional()
  public skip: number;

  @ApiProperty({
    description: 'Number of records to select after the skipped',
    example: 20,
  })
  @Transform(({ value }) => toNumber(value))
  @Min(0)
  @Max(100, {
    message: 'Max numbers of records per query are 100.',
  })
  @IsNumber()
  public take: number;
}

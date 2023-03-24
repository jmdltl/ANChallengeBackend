import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toNumber, toBoolean, toDate } from '../../../../utils/cast.helper';

export class GetAssignationsQueryParams {
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

  @ApiProperty({
    description:
      'Flag to send both user and account information, false by default',
    example: true,
  })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  public populateInfo: boolean;

  @ApiProperty({
    description: 'Property used to filter by Users name',
    example: 'Jacob',
  })
  @IsString()
  @IsOptional()
  public userName: string;

  @ApiProperty({
    description: 'Property used to filter by Account name',
    example: 'A. Systems',
  })
  @IsString()
  @IsOptional()
  public accountName: string;

  @ApiProperty({
    description: 'Filters assignations with this start date onwards',
    example: '2023-03-23T18:02:28.747Z',
  })
  @IsDate()
  @Transform(({ value }) => toDate(value))
  @IsOptional()
  public minStartDate: string;

  @ApiProperty({
    description: 'Filters assignations',
    example: '2023-03-23T18:02:28.747Z',
  })
  @IsDate()
  @Transform(({ value }) => toDate(value))
  @IsOptional()
  public maxStartDate: string;

  @ApiProperty({
    description: 'Filters assignations with this start date onwards',
    example: '2023-03-23T18:02:28.747Z',
  })
  @IsDate()
  @Transform(({ value }) => toDate(value))
  @IsOptional()
  public minEndDate: string;

  @ApiProperty({
    description: 'Filters assignations',
    example: '2023-03-23T18:02:28.747Z',
  })
  @IsDate()
  @Transform(({ value }) => toDate(value))
  @IsOptional()
  public maxEndDate: string;

  @ApiProperty({
    description:
      'Chosen field to orderby options: userName, accountName, startDate, endDate',
    example: 'endDate',
  })
  @IsString()
  @IsOptional()
  public sortBy: string;

  @ApiProperty({
    description: 'Direction for the sorting asc/desc',
    example: 'desc',
  })
  @IsString()
  @IsOptional()
  public sortOrder: string;
}

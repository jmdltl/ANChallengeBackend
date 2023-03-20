import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnglishLevel } from '@prisma/client';

export class PatchUserDTO {
  @ApiProperty({
    description: 'The First Name of the User',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'The Last Name of the User',
    example: 'Wick',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'The tech skills of the User',
    example: 'Node, React, Js, TS, etc.',
  })
  @IsString()
  @IsOptional()
  techSkills: string;

  @ApiProperty({
    description: 'The resume link of the User',
    example: 'https://some.site/file.png',
  })
  @IsString()
  @IsOptional()
  resumeLink: string;

  @ApiProperty({
    description: 'The english level of the User',
    example: EnglishLevel.B2,
  })
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel;
}

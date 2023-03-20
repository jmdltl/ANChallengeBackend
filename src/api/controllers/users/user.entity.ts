import { ApiProperty } from '@nestjs/swagger';
import { EnglishLevel, User as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string | null;

  @ApiProperty()
  lastName: string | null;

  @ApiProperty()
  password: string | null;

  @ApiProperty()
  techSkills: string | null;

  @ApiProperty()
  resumeLink: string | null;

  @ApiProperty()
  englishLevel: EnglishLevel | null;

  @ApiProperty()
  enabled: boolean;
}

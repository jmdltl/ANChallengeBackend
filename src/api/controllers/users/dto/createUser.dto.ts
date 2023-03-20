import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: 'The email addres of the User',
    example: 'lorem@ipsu.com',
  })
  @IsEmail()
  email: string;

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
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'The email addres of the User',
    example: 'lorem@ipsu.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: true,
  })
  @IsString()
  @MinLength(8)
  public password: string;
}

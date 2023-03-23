import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'The email addres of the User',
    example: 'lorem@ipsu.com',
  })
  @IsEmail()
  email: string;
}

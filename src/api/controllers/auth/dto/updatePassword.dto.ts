import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({
    description: 'The UUID sent to the email to reset the password',
    example: true,
  })
  @IsString()
  @IsUUID()
  public uuid: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: true,
  })
  @IsString()
  @MinLength(8)
  public password: string;
}

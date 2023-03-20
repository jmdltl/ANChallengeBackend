import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostClientDTO {
  @ApiProperty({
    description: 'The name of the Client',
    example: 'Apple',
  })
  @IsString()
  name: string;
}

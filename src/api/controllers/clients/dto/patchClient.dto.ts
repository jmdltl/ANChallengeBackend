import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PatchClientDTO {
  @ApiProperty({
    description: 'The name of the Client',
    example: 'Netflix',
  })
  @IsString()
  name: string;
}

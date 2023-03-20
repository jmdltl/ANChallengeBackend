import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchClientArchived {
  @ApiProperty({
    description: 'Client archived status',
    example: true,
  })
  @IsBoolean()
  public archived: boolean;
}

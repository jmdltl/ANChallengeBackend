import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchAccountArchivedDTO {
  @ApiProperty({
    description: 'Account archived status',
    example: true,
  })
  @IsBoolean()
  public archived: boolean;
}

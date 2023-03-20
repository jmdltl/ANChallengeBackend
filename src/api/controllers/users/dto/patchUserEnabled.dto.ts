import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PatchUserEnabled {
  @ApiProperty({
    description: 'User enabled status',
    example: true,
  })
  @IsBoolean()
  public enabled: false;
}

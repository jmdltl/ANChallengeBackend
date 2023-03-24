import { ApiProperty } from '@nestjs/swagger';
import { AccountAssignations as AssignationModel } from '@prisma/client';

export class AssignationEntity implements AssignationModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startDate: Date | null;

  @ApiProperty()
  endDate: Date | null;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  accountId: number;
}

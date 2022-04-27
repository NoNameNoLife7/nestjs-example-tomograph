import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRecordDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class UpdateRecordDto extends PartialType(CreateRecordDto) {}

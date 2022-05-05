import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRecordDto {
  @IsInt()
  @IsNotEmpty()
  testId: number;
}

export class UpdateRecordDto extends CreateRecordDto {}

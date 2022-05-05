import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsArray()
  directory: number[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  file?: string;

  @IsInt()
  testId: number;
}

export class UpdateImageDto extends CreateImageDto {}

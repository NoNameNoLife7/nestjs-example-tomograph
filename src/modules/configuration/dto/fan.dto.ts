import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  protocol?: string;
}

export class UpdateFanDto extends CreateFanDto {}

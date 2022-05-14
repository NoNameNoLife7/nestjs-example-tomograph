import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommunicationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  protocol?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;
}

export class UpdateCommunicationDto extends CreateCommunicationDto {}

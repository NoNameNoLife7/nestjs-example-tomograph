import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}

export class UpdateUserDto extends CreateUserDto {}

export class UserIncludeDTO extends BaseIncludeDTO {
  role?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['role']);
  }
}

export class UserRelation {
  @IsOptional()
  @Transform(({ value }) => new UserIncludeDTO(value))
  @Type(() => UserIncludeDTO)
  include: UserIncludeDTO;
}

export class UserPaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new UserIncludeDTO(value))
  @Type(() => UserIncludeDTO)
  include: UserIncludeDTO;

  where?: any;
}

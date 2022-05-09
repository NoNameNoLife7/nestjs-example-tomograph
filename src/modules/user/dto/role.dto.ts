import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRoleDto extends CreateRoleDto {}

export class RoleIncludeDTO extends BaseIncludeDTO {
  users?: boolean;

  constructor(includeQueryParam: string) {
    super(includeQueryParam, ['users']);
  }
}

export class RolePaginationDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => new RoleIncludeDTO(value))
  @Type(() => RoleIncludeDTO)
  include: RoleIncludeDTO;

  where?: any;
}

import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseIncludeDTO, PaginationDto } from 'src/common/utils/utils';

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

// class CommunicationIncludeDTO extends BaseIncludeDTO {
//   //test?: boolean;

//   constructor(includeQueryParam: string) {
//     super(includeQueryParam, []);
//   }
// }

// export class CommunicationPaginationDto extends PaginationDto {
//   @IsOptional()
//   @Transform(({ value }) => new CommunicationIncludeDTO(value))
//   @Type(() => CommunicationIncludeDTO)
//   include: CommunicationIncludeDTO;

//   where?: any;
// }

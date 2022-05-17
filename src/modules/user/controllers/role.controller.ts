import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from '../services';
import { CreateRoleDto, RolePaginationDto, UpdateRoleDto } from '../dto';
import { role as RoleModel } from '@prisma/client';
import { httpExceptionHandler } from '../../../common/utils';

@Controller('role')
export class RoleController {
  constructor(private readonly modelService: RoleService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    const instance = await this.modelService
      .getById(+id)
      .catch((e) => httpExceptionHandler(e));
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: RolePaginationDto) {
    return this.modelService.list(params).catch((e) => httpExceptionHandler(e));
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const roleModel: RoleModel | HttpException = await this.modelService
      .create(createRoleDto)
      .catch((e) => httpExceptionHandler(e));
    if (!roleModel) throw new BadRequestException('Invalid role!');
    return roleModel;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.modelService
      .update(+id, updateRoleDto)
      .catch((e) => httpExceptionHandler(e));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.modelService.delete(+id).catch((e) => httpExceptionHandler(e));
  }
}

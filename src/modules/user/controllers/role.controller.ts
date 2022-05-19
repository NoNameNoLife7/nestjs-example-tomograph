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

@Controller('role')
export class RoleController {
  constructor(private readonly modelService: RoleService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const instance = await this.modelService.getById(+id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: RolePaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const roleModel: RoleModel | HttpException = await this.modelService.create(
      createRoleDto,
    );
    if (!roleModel) throw new BadRequestException('Invalid role!');
    return roleModel;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.modelService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.modelService.delete(+id);
  }
}

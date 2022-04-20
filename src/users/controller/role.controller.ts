import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { role as RoleModel } from '@prisma/client';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleModel> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(): Promise<RoleModel[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<RoleModel | null> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleModel | null> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<RoleModel | null> {
    return this.rolesService.remove(+id);
  }
}

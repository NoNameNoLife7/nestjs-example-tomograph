import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from "./entity/role.entity";

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(): Promise<RoleEntity[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolesService.remove(+id);
  }
}

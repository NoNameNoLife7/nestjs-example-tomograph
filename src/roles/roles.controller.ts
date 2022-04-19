import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { role as RoleModel } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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

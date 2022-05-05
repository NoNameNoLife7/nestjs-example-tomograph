import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RoleService } from '../services';
import { CreateRoleDto, UpdateRoleDto } from '../dto';
import { role as RoleModel } from '@prisma/client';

@Controller('role')
export class RoleController {
  constructor(private readonly modelService: RoleService) {}

  private async getInstanceOr404(id: number): Promise<RoleModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<RoleModel | null> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<RoleModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleModel> {
    const roleModel: RoleModel = await this.modelService.create(createRoleDto);
    if (!roleModel) throw new BadRequestException('Invalid role!');
    return roleModel;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<RoleModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}

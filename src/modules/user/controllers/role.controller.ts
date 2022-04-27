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

type CreateData = CreateRoleDto;
type UpdateData = UpdateRoleDto;

@Controller('roles')
export class RoleController {
  constructor(private readonly modelService: RoleService) {}

  private async getInstanceOr404(id: number): Promise<RoleModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  private async checkUniqueConstraints(name: string) {
    const model = await this.modelService.getUniqueConstrain(name);
    if (model) throw new Error('There is already a role with that name!');
    return;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<RoleModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<RoleModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createRoleDto: CreateData): Promise<RoleModel | Error> {
    await this.checkUniqueConstraints(createRoleDto.name);
    const roleModel: RoleModel = await this.modelService.create(createRoleDto);
    if (roleModel === undefined) {
      throw new BadRequestException('Invalid role!');
    }
    return this.modelService.create(createRoleDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateData,
  ): Promise<RoleModel | null> {
    await this.getInstanceOr404(+id);
    if (updateRoleDto.name)
      await this.checkUniqueConstraints(updateRoleDto.name);
    return this.modelService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<RoleModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}

/*  private async serializeResponse(instance: RoleModel) {
  return instance;
  // const { password, ...restOfFields} = instance
  // return restOfFields;
}*/

/*
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';

@Controller("roles")
export class BaseModelController<Name> {
  constructor(private readonly modelService) {}


  private async getInstanceOr404(
      id: number,
  ): Promise<Model> {
    const instance = await this.modelService.get(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  private async checkUniqueConstraints() {
    return;
  }

  private async serializeResponse(
      instance: Model
  ) {
    return instance;
    // const { password, ...restOfFields} = instance
    // return restOfFields;
  }

  @Get(":id")
  get(@Param("id") id: string): Promise<RoleModel | null> {
    return this.rolesService.get(+id);
  }

  @Get()
  list(): Promise<RoleModel[]> {
    return this.rolesService.list();
  }

  @Post()
  create(@Body() createRoleDto: CreateDto): Promise<RoleModel> {
    this.checkUniqueConstraints()
    return this.rolesService.create(createRoleDto);
  }

  @Patch(":id")
  update(
      @Param("id") id: string,
      @Body() updateRoleDto: UpdateDto,
  ): Promise<RoleModel | null> {

    const instance = await  this.getInstanceOr404(id)
    this.checkUniqueConstraints()
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string): Promise<RoleModel | null> {
    const instance = await  this.getInstanceOr404(id)
    return this.rolesService.delete(id);
  }*/

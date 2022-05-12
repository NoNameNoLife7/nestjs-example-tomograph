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
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserPaginationDto } from '../dto';
import { user as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(@Query() params: UserPaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const UserModel: UserModel = await this.modelService.create(createUserDto);
    if (!UserModel) throw new BadRequestException('Invalid User!');
    return this.modelService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}

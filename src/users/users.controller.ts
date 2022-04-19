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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { user as UserModel } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<UserModel> {
    return this.usersService.create(data);
  }

  @Get()
  async findAll(): Promise<UserModel[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserModel | null> {
    return this.usersService.findOne({ id: Number(id) });
  }

  private async getInstanceOr404(id: number): Promise<UserModel> {
    const user = await this.usersService.findById(+id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Promise<UserModel> | null | undefined> {
    if (await this.getInstanceOr404(+id))
      return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserModel | null | undefined> {
    if (await this.getInstanceOr404(+id)) return this.usersService.remove(+id);
  }
}

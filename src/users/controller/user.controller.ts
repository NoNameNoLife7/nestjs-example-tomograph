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
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

import { user as UserModel } from '@prisma/client';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<UserModel> {
    return this.usersService.create(data);
  }

  @Get()
  async findAll(): Promise<UserModel[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<UserModel | null | undefined> {
    return await this.getInstanceOr404(+id);
  }

  private async getInstanceOr404(
    id: number,
  ): Promise<UserModel | null | undefined> {
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

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserPaginationDto } from '../dto';

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const instance = await this.modelService.getById(+id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  async list(@Query() params: UserPaginationDto) {
    return await this.modelService.list(params);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.modelService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.modelService.delete(+id);
  }
}

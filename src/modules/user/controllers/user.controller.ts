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
import { httpExceptionHandler } from 'src/common/utils';

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    const instance = await this.modelService
      .getById(+id)
      .catch((e) => httpExceptionHandler(e));
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  async list(@Query() params: UserPaginationDto) {
    return await this.modelService
      .list(params)
      .catch((e) => httpExceptionHandler(e));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.modelService
      .create(createUserDto)
      .catch((e) => httpExceptionHandler(e));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!+id) throw new NotFoundException();
    return await this.modelService
      .update(+id, updateUserDto)
      .catch((e) => httpExceptionHandler(e));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    return await this.modelService
      .delete(+id)
      .catch((e) => httpExceptionHandler(e));
  }
}

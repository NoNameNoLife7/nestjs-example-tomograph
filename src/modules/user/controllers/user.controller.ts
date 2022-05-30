import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import {
  CreateUserDto,
  UpdateUserDto,
  UserPaginationDto,
  UserRelation,
} from '../dto';

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  @Get(':id')
  async get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: UserRelation,
  ) {
    const instance = await this.modelService.getById(+id, params);
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
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return await this.modelService.delete(+id);
  }
}

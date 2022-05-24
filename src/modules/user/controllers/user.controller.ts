import {
  BadRequestException,
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
  async get(@Param('id') id: string, @Query() params: UserRelation) {
    if (!+id) throw new BadRequestException('The id must be a number');
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return await this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return await this.modelService.delete(+id);
  }
}

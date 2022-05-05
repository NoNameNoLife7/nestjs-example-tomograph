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
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { user as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  private async getInstanceOr404(id: number): Promise<UserModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<UserModel> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<UserModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    const UserModel: UserModel = await this.modelService.create(createUserDto);
    if (!UserModel) throw new BadRequestException('Invalid User!');
    return this.modelService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}

/*  private async serializeResponse(instance: UserModel) {
  return instance;
  // const { password, ...restOfFields} = instance
  // return restOfFields;
}*/

// private async checkUniqueConstraints(name: string) {
//   const model = await this.modelService.getUniqueConstrain(name);
//   if (model)
//     throw new HttpException('There is already a User with that name!', 500);
//   return;
// }

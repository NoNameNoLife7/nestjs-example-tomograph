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

type CreateData = CreateUserDto;
type UpdateData = UpdateUserDto;

@Controller('user')
export class UserController {
  constructor(private readonly modelService: UserService) {}

  private async getInstanceOr404(id: number): Promise<UserModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  private async checkUniqueConstraints(name: string) {
    const model = await this.modelService.getUniqueConstrain(name);
    if (model) throw new Error('There is already a User with that name!');
    return;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<UserModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<UserModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createUserDto: CreateData): Promise<UserModel | Error> {
    await this.checkUniqueConstraints(createUserDto.email);
    const UserModel: UserModel = await this.modelService.create(createUserDto);
    if (UserModel === undefined) {
      throw new BadRequestException('Invalid User!');
    }
    return this.modelService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateData,
  ): Promise<UserModel | null> {
    await this.getInstanceOr404(+id);
    if (updateUserDto.email)
      await this.checkUniqueConstraints(updateUserDto.email);
    return this.modelService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}

/*  private async serializeResponse(instance: UserModel) {
  return instance;
  // const { password, ...restOfFields} = instance
  // return restOfFields;
}*/

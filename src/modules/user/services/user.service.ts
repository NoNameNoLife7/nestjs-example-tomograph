import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { user } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  get user() {
    return this.prisma.user;
  }

  getById(id: number): Promise<user | null> {
    return this.user.findUnique({
      where: { id },
    });
  }

  list(): Promise<user[]> {
    return this.user.findMany();
  }

  create(createUserDto: CreateUserDto): Promise<user> {
    return this.user.create({
      data: createUserDto,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<user> {
    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  delete(id: number): Promise<user> {
    return this.user.delete({ where: { id } });
  }
}

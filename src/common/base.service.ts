/*
import { Injectable } from '@nestjs/common';
/!*import { Delegate } from './delegate';
import { BaseTypeMap } from './base.type.map';*!/
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export abstract class BaseService {
  protected constructor(
    private readonly prisma: PrismaService,
    protected modelName: string,
  ) {}

  get model() {
    return this.prisma[this.modelName];
  }

  public findMany() {
    return this.model.findMany();
  }
}
/!*

import { Injectable } from '@nestjs/common';
import { Delegate } from './delegate';
import { BaseTypeMap } from './base.type.map';

@Injectable()
export abstract class BaseService<
    D extends Delegate,
    T extends BaseTypeMap,
    CreateDto,
    UpdateDto,
    > {
  protected constructor(protected delegate: D) {}

  public getDelegate(): D {
    return this.delegate;
  }

  public async create(data: CreateDto): Promise<T['create']> {
    const result = await this.delegate.create(data);
    return result;
  }

  public async update(data: UpdateDto): Promise<T['update']> {
    const result = await this.delegate.update(data);
    return result;
  }

  public async findMany(data: T['findMany']): Promise<T['findMany']> {
    const result = await this.delegate.findMany(data);
    return result;
  }

  public async findFirst(data: T['findFirst']): Promise<T['findFirst']> {
    const result = await this.delegate.findFirst(data);
    return result;
  }

  public async findUnique(data: T['findUnique']): Promise<T['findUnique']> {
    const result = await this.delegate.findUnique(8);
    return result;
  }

  public async findById(data: number): Promise<T['findById']> {
    const result = await this.delegate.findUnique({ where: { id: data } });
    return result;
  }

  public async delete(data: number): Promise<T['delete']> {
    const result = await this.delegate.delete({ where: { id: data } });
    return result;
  }

  public async deleteMany(data: number[]): Promise<T['deleteMany']> {
    const result = await this.delegate.deleteMany({ where: { id: data } });
    return result;
  }
}
*!/
*/

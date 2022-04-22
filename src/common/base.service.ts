import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Delegate } from './delegate';
import { BaseTypeMap } from './base.type.map';

@Injectable()
export abstract class BaseService<D extends Delegate, T extends BaseTypeMap> {
  protected constructor(protected delegate: D) {}

  public getDelegate(): D {
    return this.delegate;
  }

  public async aggregate(data: T['aggregate']) {
    const result = await this.delegate.aggregate(data);
    return result;
  }

  public async count(data: T['count']) {
    const result = await this.delegate.count(data);
    return result;
  }

  public async create(data: T['create']) {
    const result = await this.delegate.create(data);
    return result;
  }

  public async findMany(data: T['findMany']) {
    const result = await this.delegate.findMany(data);
    return result;
  }

  // other methods to wrap prisma (findFirst, update, blah...)
}

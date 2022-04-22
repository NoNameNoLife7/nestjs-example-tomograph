import { Prisma } from '@prisma/client';
import { BaseTypeMap } from '../../common/base.type.map';

export class UserTypeMap implements BaseTypeMap {
  aggregate: Prisma.UserAggregateArgs;
  count: Prisma.userCountArgs;
  create: Prisma.userCreateArgs;
  delete: Prisma.userDeleteArgs;
  deleteMany: Prisma.userDeleteManyArgs;
  findFirst: Prisma.userFindFirstArgs;
  findMany: Prisma.userFindManyArgs;
  findUnique: Prisma.userFindUniqueArgs;
  update: Prisma.userUpdateArgs;
  updateMany: Prisma.userUpdateManyArgs;
  upsert: Prisma.userUpsertArgs;
}
